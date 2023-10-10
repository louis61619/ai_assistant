import { MessageList } from '@/types';
import { createParser, type ParsedEvent, type ReconnectInterval } from 'eventsource-parser';

type StreamPayload = {
  model: string;
  messages: MessageList;
  temperature: number;
  stream: boolean;
  max_tokens: number;
};

const sleep = (time: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, time);
  });
};

const encoder = new TextEncoder();

async function* makeIterator() {
  const string = `This is a fake response. If you want to use it, please clone and use the env file to set OPENAI_API_KEY.`;
  const arr = string.split(' ');
  for (let i = 0; i < arr.length; i++) {
    const isLastWord = i === arr.length - 1;
    const word = arr[i] + (isLastWord ? '' : ' ');
    yield encoder.encode(word);
    if (!isLastWord) {
      await sleep(100);
    }
  }
}

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function fakeReadableStream(): ReadableStream<Uint8Array> {
  return iteratorToStream(makeIterator());
}

export async function POST(req: Request, res: Response) {
  const { prompt, history = [], options = {} } = await req.json();

  const { max_tokens, temperature } = options;

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: options.prompt,
      },
      ...history,
      {
        role: 'user',
        content: prompt,
      },
    ],
    stream: true,
    // ...options,
    temperature: +temperature || 0.7,
    max_tokens: +max_tokens || 1000,
  };

  if (process.env.DEMO === 'true') {
    const stream = fakeReadableStream();
    return new Response(stream);
  }
  const stream = await requestStream(data);
  return new Response(stream);
}

const requestStream = async (payload: StreamPayload) => {
  const counter = 0;
  const resp = await fetch(`${process.env.GPT_END_POINT}/v1/chat/completions`, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });
  // handle error
  if (resp.status !== 200) {
    return resp.body;
  }
  return createStream(resp, counter);
};

const createStream = (response: Response, counter: number) => {
  const decoder = new TextDecoder('utf-8');
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const onParse = (e: ParsedEvent | ReconnectInterval) => {
        if (e.type === 'event') {
          const data = e.data;
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text: string = json.choices[0]?.delta?.content || '';
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            // console.log(text);
            const q = encoder.encode(text);
            controller.enqueue(q);
            counter++;
          } catch (erroe) {}
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of response.body as any) {
        // console.log(decoder.decode(chunk));
        parser.feed(decoder.decode(chunk));
      }
    },
  });
};

// export const runtime = 'edge';

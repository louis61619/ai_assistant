import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { MessageList } from '@/types';
import stream from 'stream';
import fs from 'fs';
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

function fakeReadableStream(): ReadableStream<Uint8Array> {
  const Readable = stream.Readable;
  const _stream = new Readable();
  _stream._read = () => {}; // redundant? see update below
  _stream.push(`it's fake chat gpt answer`);
  _stream.push(null);
  return new ReadableStream({
    start(controller) {
      _stream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
      _stream.on('end', () => controller.close());
      _stream.on('error', (error: NodeJS.ErrnoException) => controller.error(error));
    },
    cancel() {
      _stream.destroy();
    },
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  yield encoder.encode('<p>One</p>');
  await sleep(200);
  yield encoder.encode('<p>Two</p>');
  await sleep(200);
  yield encoder.encode('<p>Three</p>');
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

export async function POST(req: Request, res: Response) {
  const { prompt, history = [], options = {} } = await req.json();

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      ...history,
      {
        role: 'user',
        content: prompt,
      },
    ],
    stream: true,
    ...options,
  };

  // const stream = fakeReadableStream();
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

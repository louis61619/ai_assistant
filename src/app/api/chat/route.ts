import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';

const sleep = (time: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, time);
  });
};

export async function POST(req: Request) {
  // const data = {
  //   model: 'gpt-3.5-turbo',
  //   messages: [
  //     {
  //       role: 'user',
  //       content: 'hello',
  //     },
  //   ],
  // };
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
    ...options,
  };

  // await sleep(1500);

  // console.log(data);

  // return NextResponse.json({
  //   role: 'assistant',
  //   content: `I'm fake chat`,
  // });

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  });

  const json = await resp.json();

  return NextResponse.json({ ...json.choices?.[0].message });
}

'use client';
import { ChatLogsType } from '@/types';
import { IconEraser, IconSend } from '@tabler/icons-react';
import { clearChatLogs, getChatLogs, updateChatLogs } from '@/utils/chatStorage';
import { getCompletion } from '@/utils/getCompletion';
import { getLocal, setLocal } from '@/utils/storage';
import { ActionIcon, Button, Textarea, clsx } from '@mantine/core';
import React, { useEffect, useState, KeyboardEvent } from 'react';

const id = '123';

export const Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState<ChatLogsType>([]);

  useEffect(() => {
    const logs = getChatLogs(id);
    setChatList(logs);
  }, []);

  const getAIResponse = async () => {
    setLoading(true);
    const resp = await getCompletion({
      prompt,
      history: chatList.slice(-4),
    });
    // setCompletion(resp.content);
    const newList = [
      ...chatList,
      {
        role: 'user',
        content: prompt,
      },
      {
        role: 'assistant',
        content: resp.content,
      },
    ];
    setLoading(false);
    setPrompt('');
    setChatList(newList);
    updateChatLogs(id, newList);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getAIResponse();
    }
  };

  const onClear = () => {
    setChatList([]);
    clearChatLogs(id);
  };

  return (
    <div className="flex h-screen flex-col items-center">
      <div className="flex h-[calc(100vh-10rem)] w-full flex-col overflow-y-auto rounded-sm px-8 pb-8">
        {chatList.map((chat, index) => {
          return (
            <div
              className={clsx(
                {
                  flex: chat.role === 'user',
                  'flex-col': chat.role === 'user',
                  'items-end': chat.role === 'user',
                  'self-end': chat.role === 'user',
                },
                'mt-4',
                'w-11/12',
              )}
              key={`${chat.role}-${index}`}
            >
              <div>{chat.role}</div>
              <div className=" mt-1 w-full max-w-4xl rounded-md px-4 py-2 shadow-md">{chat.content}</div>
            </div>
          );
        })}
      </div>
      <div className="flex w-full items-center px-8">
        <ActionIcon loading={loading} onClick={onClear}>
          <IconEraser />
        </ActionIcon>
        <Textarea
          placeholder="Enter yout prompt"
          className="mb-3 w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => onKeyDown(e)}
          id="1"
        ></Textarea>
        <ActionIcon loading={loading} onClick={() => getAIResponse()}>
          <IconSend />
        </ActionIcon>
        {/* <Button loading={loading} className="self-end" color="green" type="submit" onClick={() => getAIResponse()}>
          send
        </Button> */}
      </div>

      {/* <div>{completion}</div> */}
    </div>
  );
};

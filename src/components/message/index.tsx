'use client';
import { MessageList } from '@/types';
import { IconEraser, IconSend, IconSendOff } from '@tabler/icons-react';
import { clearMessages, getMessges, updateMessages } from '@/utils/chatStorage';
import { getCompletion } from '@/utils/getCompletion';
import { getLocal, setLocal } from '@/utils/storage';
import { ActionIcon, Button, Textarea, clsx } from '@mantine/core';
import React, { useEffect, useState, KeyboardEvent } from 'react';
import chatService from '@/utils/chatService';

export const Message = ({ sessionId: id }: { sessionId: string }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState<MessageList>([]);

  const setSuggestion = (suggestion: string) => {
    if (suggestion === '') {
      return;
    }
    const len = chatList.length;
    const lastMesage = len ? chatList[len - 1] : null;
    let newList: MessageList = [];
    if (lastMesage?.role === 'assistant') {
      newList = [
        ...chatList.slice(0, len - 1),
        {
          ...lastMesage,
          content: suggestion,
        },
      ];
    } else {
      newList = [
        ...chatList,
        {
          role: 'assistant',
          content: suggestion,
        },
      ];
    }
    setMessages(newList);
  };

  chatService.actions = {
    onCompleting: (sug) => setSuggestion(sug),
    onCompleted: () => setLoading(false),
  };

  useEffect(() => {
    const logs = getMessges(id);
    console.log(logs);
    setChatList(logs);
  }, []);

  const onSubmit = () => {
    if (loading) {
      chatService.cancel();
      setLoading(false);
      return;
    }
    if (!prompt.trim()) return;
    const list: MessageList = [
      ...chatList,
      {
        role: 'user',
        content: prompt,
      },
    ];
    setChatList(list);
    setLoading(true);
    setPrompt('');
    chatService.getStream({
      prompt,
      history: chatList.slice(-4),
    });
  };

  const setMessages = (logs: MessageList) => {
    setChatList(logs);
    updateMessages(id, logs);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const onClear = () => {
    setChatList([]);
    clearMessages(id);
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
        <ActionIcon
          onClick={() => {
            try {
              onSubmit();
            } catch (error) {
              setLoading(false);
            }
          }}
        >
          {loading ? <IconSendOff /> : <IconSend />}
        </ActionIcon>
      </div>
    </div>
  );
};

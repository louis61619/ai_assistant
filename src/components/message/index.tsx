'use client';
import { Assistant, MessageList } from '@/types';
import chatService from '@/utils/chatService';
import * as chatStorage from '@/utils/chatStorage';
import { ActionIcon, Textarea, clsx } from '@mantine/core';
import { IconEraser, IconSend, IconSendOff, IconSettings } from '@tabler/icons-react';
import Link from 'next/link';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { AssistantSelect } from '../assistant-select';

const { clearMessages, getMessges, updateMessages } = chatStorage;

export const Message = ({ sessionId: id }: { sessionId: string }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessageList] = useState<MessageList>([]);
  const [assistant, setAssistant] = useState<Assistant>();
  const [oldId, setOldId] = useState('');
  const [isInBottm, setIsInBottom] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    const session = chatStorage.getSession(id);
    setAssistant(session?.assistant);
  }, [id]);

  const onAssistantChange = (assistant: Assistant) => {
    chatStorage.updateSession(id, {
      assistant: assistant.id,
    });
    setAssistant(assistant);
  };

  const setSuggestion = (suggestion: string) => {
    if (suggestion === '') {
      return;
    }
    const len = messages.length;
    const lastMesage = len ? messages[len - 1] : null;
    let newList: MessageList = [];
    if (lastMesage?.role === 'assistant') {
      newList = [
        ...messages.slice(0, len - 1),
        {
          ...lastMesage,
          content: suggestion,
        },
      ];
    } else {
      newList = [
        ...messages,
        {
          role: 'assistant',
          content: suggestion,
        },
      ];
    }
    setMessages(newList);
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isInBottm && loading) {
      scrollToBottom();
    }
  }, [messages, isInBottm, loading]);

  useEffect(() => {
    if (!loading && messages.length > 0 && !init) {
      scrollToBottom();
      setInit(true);
    }
  }, [messages, init, loading]);

  chatService.actions = {
    onCompleting: (sug) => setSuggestion(sug),
    onCompleted: () => setLoading(false),
  };

  useEffect(() => {
    if (id !== oldId) {
      setOldId(id);
      setInit(false);
      if (loading) {
        chatService.cancel();
        setLoading(false);
      }
    }
  }, [id, oldId, loading]);

  useEffect(() => {
    if (!id) return;
    const logs = getMessges(id);
    setMessageList(logs);
  }, [id]);

  const onSubmit = () => {
    if (loading) {
      chatService.cancel();
      setLoading(false);
      return;
    }
    if (!prompt.trim()) return;
    const list: MessageList = [
      ...messages,
      {
        role: 'user',
        content: prompt,
      },
    ];

    setMessageList(list);
    setLoading(true);
    setPrompt('');
    chatService.getStream({
      prompt,
      history: messages.slice(-assistant?.max_log!),
      options: assistant,
    });
  };

  const setMessages = (logs: MessageList) => {
    setMessageList(logs);
    updateMessages(id, logs);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const onClear = () => {
    setMessages([]);
  };

  return (
    <div className="relative flex w-full flex-1 overflow-y-auto">
      <div className="absolute top-0 w-full shadow-sm">
        <div className="relative mx-auto flex h-[3rem] w-[calc(100%-50px)] items-center justify-center bg-white pr-4 lg:w-[calc(100%-115px)]">
          {/* <Select data={sessionList.map((session) => session.name)}></Select> */}
          {/* <Popover>
            <Popover.Target>
              <div className="flex cursor-pointer items-center">
                ai assistant
                <ActionIcon className="ml-1">
                  <IconDotsVertical />
                </ActionIcon>
              </div>
            </Popover.Target>
            <Popover.Dropdown className="p-0">
              <div className="w-[160px]">
                <div className="flex cursor-pointer p-2 text-gray-600 hover:bg-gray-200/60">ai assistant</div>
                <div className="flex cursor-pointer justify-end p-2 text-gray-600 hover:bg-gray-200/60">
                  <IconPlus />
                </div>
              </div>
            </Popover.Dropdown>
          </Popover> */}
          {assistant?.id ? (
            <AssistantSelect value={assistant?.id!} onChange={onAssistantChange} loading={false} />
          ) : null}

          <ActionIcon className="absolute right-2">
            <Link href="/assistant">
              <IconSettings />
            </Link>
          </ActionIcon>
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto"
        ref={listRef}
        onScroll={(e: React.UIEvent<HTMLDivElement>) => {
          const targetElement = e.target as HTMLDivElement;
          const scrollHeight = targetElement.scrollHeight || 0;
          const clientHeight = targetElement.clientHeight || 0;
          const scrollTop = targetElement?.scrollTop || 0;
          if (scrollTop + clientHeight >= scrollHeight) {
            setIsInBottom(true);
          } else {
            setIsInBottom(false);
          }
        }}
      >
        <div className="mx-auto flex w-[calc(100%-50px)] flex-col rounded-sm px-4 pb-[180px] pt-[60px] lg:w-[calc(100%-115px)]">
          {messages.map((chat, index) => {
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
                )}
                key={`${chat.role}-${index}`}
              >
                <div>{chat.role}</div>
                <div className=" mt-1 w-full max-w-4xl rounded-md px-4 py-2 shadow-md">{chat.content}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        <div className="mx-auto flex w-[calc(100%-50px)] items-center bg-white pb-4 pr-4 pt-2 lg:w-[calc(100%-115px)]">
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
    </div>
  );
};

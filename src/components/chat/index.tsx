'use client';
import React, { useEffect, useState } from 'react';
import { Message } from '../message';
import { Session } from '../session';
import { addSession, getSession, getSessionList } from '@/utils/chatStorage';

export const Chat = () => {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const init = () => {
      let list = getSessionList();
      if (list.length === 0) {
        list = addSession({
          id: new Date().valueOf().toString(),
          name: 'New chat',
        });
      }
      const id = list[0].id;

      setSessionId(id);
    };
    init();
  }, []);

  if (!sessionId) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Session
        sessionId={sessionId}
        onChange={(id) => {
          setSessionId(id);
        }}
      />
      <Message sessionId={sessionId} />
    </div>
  );
};

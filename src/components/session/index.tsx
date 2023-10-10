import { SessionList } from '@/types';
import * as chatStorage from '@/utils/chatStorage';
import { ActionIcon, ColorScheme, clsx, useMantineColorScheme } from '@mantine/core';
import { IconMessagePlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { EdittableText } from '../editable-text';

type SessionProps = {
  sessionId: string;
  onChange: (id: string) => void;
};

const itemBaseClasses = 'flex cursor-pointer h-[2.4rem] items-center justify-between group px-2 rounded-md';

const generateItemClass = (id: string, sessionId: string, colorScheme: ColorScheme) => {
  return clsx([
    itemBaseClasses,
    {
      'hover:bg-gray-300/69': colorScheme === 'light',
      'bg-gray-200/60': id !== sessionId && colorScheme === 'light',
      'bg-gray-300': id === sessionId && colorScheme === 'light',
      'hover:bg-zinc-800/50': colorScheme === 'dark',
      'bg-zinc-800/20': id !== sessionId && colorScheme === 'dark',
      'bg-zinc-800/90': id === sessionId && colorScheme === 'dark',
    },
  ]);
};

export const Session = ({ sessionId, onChange }: SessionProps) => {
  const [sessionList, setSessionList] = useState<SessionList>([]);
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    const list = chatStorage.getSessionList();
    setSessionList(list);
    // setSessionList(Object.keys(list).reduce())
  }, []);

  const createSession = () => {
    const newSession = {
      id: new Date().valueOf().toString(),
      name: `New chat`,
    };
    const list = chatStorage.addSession(newSession);
    setSessionList(list);
  };

  const removeSession = (id: string) => {
    const list = chatStorage.removeSession(id);
    if (sessionId === id) {
      onChange(list[0].id);
    }
    setSessionList(list);
  };

  return (
    <div className={clsx('w-44', 'flex', 'flex-col', 'px-2', 'py-2', 'gap-y-2')}>
      <div className="flex justify-between">
        <ActionIcon onClick={() => createSession()}>
          <IconMessagePlus />
        </ActionIcon>
      </div>
      <div className="overflow-y-auto pr-2">
        <div className="flex flex-col gap-y-2 pb-4">
          {sessionList.map((session) => {
            const { id } = session;

            return (
              <div
                className={generateItemClass(id, sessionId, colorScheme)}
                key={session.id}
                onClick={() => {
                  onChange(id);
                }}
              >
                {/* <div className="flex-1 overflow-hidden text-ellipsis">{session.name}</div> */}
                <EdittableText
                  text={session.name}
                  onSave={(name) => chatStorage.updateSession(id, { name })}
                  active={session.id === sessionId}
                />
                <IconTrash
                  className="invisible mx-1 cursor-pointer group-hover:visible"
                  color="gray"
                  onClick={() => {
                    removeSession(session.id);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

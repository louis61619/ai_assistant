import { SessionList } from '@/types';
import * as chatStorage from '@/utils/chatStorage';
import { ActionIcon, MantineColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMessagePlus, IconTrash } from '@tabler/icons-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { EdittableText } from '../editable-text';

type SessionProps = {
  sessionId: string;
  onChange: (id: string) => void;
};

const itemBaseClasses = 'flex cursor-pointer h-[2.4rem] items-center justify-between group px-2 rounded-md';

const generateItemClass = (id: string, sessionId: string, MantineColorScheme: MantineColorScheme) => {
  return clsx([
    itemBaseClasses,
    {
      'hover:bg-gray-300/69': MantineColorScheme === 'light',
      'bg-gray-200/60': id !== sessionId && MantineColorScheme === 'light',
      'bg-gray-300': id === sessionId && MantineColorScheme === 'light',
      'hover:bg-zinc-800/50': MantineColorScheme === 'dark',
      'bg-zinc-800/20': id !== sessionId && MantineColorScheme === 'dark',
      'bg-zinc-800/90': id === sessionId && MantineColorScheme === 'dark',
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
    onChange(newSession.id);
  };

  const removeSession = (id: string) => {
    const list = chatStorage.removeSession(id);
    setSessionList(list);

    if (sessionId === id) {
      onChange(list[0].id);
    }
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
                {sessionList.length > 1 ? (
                  <IconTrash
                    className="invisible mx-1 cursor-pointer group-hover:visible"
                    color="gray"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSession(session.id);
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import { Message, ChatLogsStorageType, MessageList, Session, SessionList, SessionInfo } from '@/types';
import { getLocal, setLocal } from './storage';
import { ASSISTANT_INIT, MESSAGES_STORAGE_KEY, SESSION_STORAGE_KEY } from '@/constants';
import assistantStore from './assitantStore';
import { newId } from './newId';

const getMessagesContanier = () => {
  let list = getLocal<ChatLogsStorageType>(MESSAGES_STORAGE_KEY);

  if (!list || !(typeof list === 'object' && !Array.isArray(list))) {
    list = {};
    setLocal(MESSAGES_STORAGE_KEY, list);
  }
  return list;
};

export const getMessges = (id: string) => {
  const logs = getMessagesContanier();
  return logs[id] || [];
};

export const updateMessages = (id: string, log: MessageList) => {
  const logs = getMessagesContanier();
  logs[id] = log;
  setLocal(MESSAGES_STORAGE_KEY, logs);
};

export const clearMessages = (id: string) => {
  const logs = getMessagesContanier();
  if (logs[id]) {
    logs[id] = [];
  }
  setLocal(MESSAGES_STORAGE_KEY, logs);
};

const setLocalSession = (list: SessionList) => {
  setLocal(SESSION_STORAGE_KEY, list);
};

export const getSessionList = (): SessionList => {
  let list = getLocal<SessionList>(SESSION_STORAGE_KEY);
  const assistant = assistantStore.getList()[0];
  if (!list) {
    const session = {
      name: 'chat',
      assistant: assistant.id,
      id: newId(),
    };
    list = [session];
    updateMessages(session.id, []);
    setLocalSession(list);
  }
  return list;
};

const getInitAssistant = () => {
  return assistantStore.getList()[0];
};

export const getSession = (id: string): SessionInfo | null => {
  const sessions = getSessionList();
  const session = sessions.find((s) => s.id === id);
  if (!session) return null;
  const { assistant } = session as Session;
  let assistantInfo = assistantStore.getAssistant(assistant);
  if (!assistantInfo) {
    const initAssistantInfo = getInitAssistant();
    assistantInfo = initAssistantInfo;
    updateSession(session.id, { assistant: assistantInfo.id });
  }

  return {
    ...session,
    assistant: assistantInfo,
  };
};

export const addSession = (newSession: Omit<Session, 'assistant'>) => {
  const sessions = getSessionList();
  const newList: SessionList = [
    ...sessions,
    {
      ...newSession,
      assistant: getInitAssistant().id,
    },
  ];
  setLocalSession(newList);
  return newList;
};

export const updateSession = (id: string, data: Partial<Session>) => {
  const sessions = getSessionList();
  const newSessions = sessions.map((s) => {
    if (s.id === id) {
      return {
        ...s,
        ...data,
      };
    }
    return s;
  });
  setLocalSession(newSessions);
};

export const removeSession = (id: string) => {
  const sessions = getSessionList();
  const newSessions = sessions.filter((s) => s.id !== id);
  setLocalSession(newSessions);
  return newSessions;
};

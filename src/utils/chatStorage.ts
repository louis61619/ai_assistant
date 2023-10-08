import { Message, ChatLogsStorageType, MessageList, SessionList, Session } from '@/types';
import { getLocal, setLocal } from './storage';
import { MESSAGES_STORAGE_KEY, SESSION_STORAGE_KEY } from '@/constants';

const getMessagesContanier = () => {
  let list = getLocal<ChatLogsStorageType>(MESSAGES_STORAGE_KEY);

  if (!list) {
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

export const getSessionContainer = () => {
  let list = getLocal<{ [key: string]: Session }>(SESSION_STORAGE_KEY);

  if (!list) {
    list = {};
    setLocal(MESSAGES_STORAGE_KEY, list);
  }
  return list;
};

export const getSession = (id: string) => {
  const sessions = getSessionContainer();
  return sessions[id] || {};
};

export const updateSession = (id: string, data: Session) => {
  const sessions = getSessionContainer();
  sessions[id] = data;
  setLocal(MESSAGES_STORAGE_KEY, data);
};

export const removeSession = (id: string) => {
  const sessions = getSessionContainer();
  delete sessions[id];
  setLocal(SESSION_STORAGE_KEY, sessions);
};

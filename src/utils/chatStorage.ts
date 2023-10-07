import { ChatLogType, ChatLogsStorageType, ChatLogsType } from '@/types';
import { getLocal, setLocal } from './storage';

const CHAT_LOGS_KEYS = 'ai_chatLogs';

export const getChatLogsContanier = () => {
  let list = getLocal<ChatLogsStorageType>(CHAT_LOGS_KEYS);

  if (!list) {
    list = {};
    setLocal(CHAT_LOGS_KEYS, list);
  }
  return list;
};

export const getChatLogs = (id: string) => {
  const logs = getChatLogsContanier();
  return logs[id] || [];
};

export const updateChatLogs = (id: string, log: ChatLogsType) => {
  const logs = getChatLogsContanier();
  logs[id] = log;
  setLocal(CHAT_LOGS_KEYS, logs);
};

export const clearChatLogs = (id: string) => {
  const logs = getChatLogsContanier();
  if (logs[id]) {
    logs[id] = [];
  }
  setLocal(CHAT_LOGS_KEYS, logs);
};

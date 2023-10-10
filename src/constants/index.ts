import { Assistant } from '@/types';

export const MESSAGES_STORAGE_KEY = 'MESSAGES_KEY';
export const SESSION_STORAGE_KEY = 'SESSION_STORAGE_KEY';
export const ASSISTANT_STORAGE_KEY = 'ASSISTANT_STORAGE_KEY';
export const ASSISTANT_INIT: Omit<Assistant, 'id'>[] = [
  {
    name: 'AI assistant',
    prompt: 'You are a smart AI assistant whose task is to answer every question of the user in detail',
    temperature: 0.7,
    max_log: 4,
    max_tokens: 800,
  },
];

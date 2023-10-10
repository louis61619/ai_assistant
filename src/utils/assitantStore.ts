import { ASSISTANT_INIT, ASSISTANT_STORAGE_KEY } from '@/constants';
import { getLocal, setLocal } from './storage';
import { Assistant, AssistantList, EditAssistant } from '@/types';

const getList = () => {
  let list = getLocal<AssistantList>(ASSISTANT_STORAGE_KEY);
  if (!list) {
    list = ASSISTANT_INIT.map((item, index) => {
      return {
        ...item,
        id: index + Date.now().toString(),
      };
    });

    updateList(list);
  }
  return list;
};

const updateList = (list: AssistantList) => {
  console.log(list);
  setLocal(ASSISTANT_STORAGE_KEY, list);
};

const addAssitant = (assistant: Assistant) => {
  const list = getList();
  const newList = [...list, assistant];
  updateList(newList);
  return newList;
};

const updataAssistant = (id: string, data: EditAssistant) => {
  const list = getList();
  const index = list.findIndex((item) => item.id === id);
  if (index > -1) {
    list[index] = {
      ...list[index],
      ...data,
    };
    updateList(list);
  }
  return list;
};

const reomveAssistant = (id: string) => {
  const list = getList();
  const newList = list.filter((item) => item.id !== id);
  updateList(newList);
  return newList;
};

const getAssistant = (id: string) => {
  const list = getList();
  return list.find((item) => item.id === id);
};

const assistantStore = {
  getList,
  addAssitant,
  updataAssistant,
  reomveAssistant,
  getAssistant,
};

export default assistantStore;

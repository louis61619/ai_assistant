import { Assistant, AssistantList } from '@/types';
import assistantStore from '@/utils/assitantStore';
import { Select } from '@mantine/core';
import { useEffect, useState } from 'react';

type Props = {
  value: string;
  loading: boolean;
  onChange: (value: Assistant) => void;
};

export const AssistantSelect = ({ value, loading, onChange }: Props) => {
  const [list, setList] = useState<AssistantList>([]);
  useEffect(() => {
    const store = assistantStore.getList();
    setList(store);
  }, []);

  const onAssistantChange = (id: string) => {
    const assistant = list.find((item) => item.id === id);
    if (assistant) {
      onChange(assistant);
    }
  };

  return (
    <Select
      onChange={onAssistantChange}
      disabled={loading}
      className="[&_.mantine-Select-input]:text-center [&_.mantine-Select-input]:font-bold"
      variant="unstyled"
      value={value}
      data={list.map((item) => ({
        value: item.id,
        label: item.name,
      }))}
    ></Select>
  );
};

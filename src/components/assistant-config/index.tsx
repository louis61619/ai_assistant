import { EditAssistant } from '@/types';
import { Button, Group, TextInput } from '@mantine/core';
// import { Wrapper } from '@mantine/core'
import { FormEvent, useState } from 'react';

type Props = {
  assistant: EditAssistant;
  save: (data: EditAssistant) => void;
  remove: (id: string) => void;
};

export const AssistantConfig = ({ save, assistant, remove }: Props) => {
  const [data, setData] = useState<EditAssistant>(assistant);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    save(data);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <div className="flex w-full justify-center">
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
        <TextInput
          label="Name"
          variant="filled"
          name="name"
          description="Assistant name"
          value={data.name}
          onChange={onChange}
          required
        ></TextInput>
        <TextInput
          label="Prompt"
          variant="filled"
          name="prompt"
          description="prompt to chatgpt"
          value={data.prompt}
          onChange={onChange}
          required
        ></TextInput>
        <TextInput
          label="Description"
          variant="filled"
          name="description"
          description="this prompt description"
          value={data.description}
          onChange={onChange}
        ></TextInput>

        <TextInput
          label="Temperature"
          variant="filled"
          name="temperature"
          description="Assistant temperature"
          value={data.temperature}
          onChange={onChange}
        ></TextInput>
        <TextInput
          label="Max log"
          variant="filled"
          name="max_log"
          description="Assistant log with max token"
          value={data.max_log}
          onChange={onChange}
        ></TextInput>
        <TextInput
          label="Max tokens"
          variant="filled"
          name="max_tokens"
          description="Assistant reply with max token"
          value={data.max_tokens}
          onChange={onChange}
        ></TextInput>
        <Group className="flex justify-end">
          <Button type="submit">confirm</Button>
          {data.id ? (
            <Button variant="default" onClick={() => data.id && remove(data.id)}>
              reomve
            </Button>
          ) : null}
        </Group>
      </form>
    </div>
  );
};

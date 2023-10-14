'use client';
import { AssistantConfig } from '@/components/assistant-config';
import { ASSISTANT_INIT } from '@/constants';
import { AssistantList, EditAssistant } from '@/types';
import assistantStore from '@/utils/assitantStore';
import { newId } from '@/utils/newId';
import { ActionIcon, Badge, Card, Drawer, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconChevronLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const showNotification = (message: string) => {
  notifications.show({
    id: 'Success',
    title: 'Success',
    message,
    autoClose: 3000,
  });
};

export default function Assistant() {
  const [assistantList, setAssistantList] = useState<AssistantList>([]);
  const [opened, drawerHandler] = useDisclosure(false);
  const [editAssistant, setEditAssistant] = useState<EditAssistant>();

  useEffect(() => {
    const list = assistantStore.getList();
    setAssistantList(list);
  }, []);

  const saveAssistant = (data: EditAssistant) => {
    console.log(data);
    if (data.id) {
      const newAssistantList = assistantStore.updataAssistant(data.id, data);
      setAssistantList(newAssistantList);
    } else {
      const newAssistant = {
        ...data,
        id: newId(),
      };
      const newAssistantList = assistantStore.addAssitant(newAssistant);
      setAssistantList(newAssistantList);
    }
    showNotification('save success');
    drawerHandler.close();
  };

  const removeAssistant = (id: string) => {
    let newAssistantList = assistantStore.reomveAssistant(id);
    setAssistantList(newAssistantList);
    showNotification('remove success');
    drawerHandler.close();
  };

  const onEditAssistant = (data: EditAssistant) => {
    setEditAssistant(data);
    drawerHandler.open();
  };

  const onAddAssistant = () => {
    const newAssistant = {
      ...ASSISTANT_INIT[0],
      name: `new assistant`,
    };
    setEditAssistant(newAssistant);

    drawerHandler.open();
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-between p-4 shadow-sm">
        <Link href="/">
          <ActionIcon>
            <IconChevronLeft />
          </ActionIcon>
        </Link>
        <Text fw={500} size="lg">
          assistan
        </Text>
        <ActionIcon onClick={() => onAddAssistant()}>
          <IconPlus />
        </ActionIcon>
      </div>
      <div className="flex flex-wrap gap-8 overflow-y-auto p-4">
        {assistantList.map((item, index) => (
          <Card
            key={item.id}
            shadow="sm"
            padding="lg"
            radius="md"
            className="group w-full max-w-sm transition-all duration-300"
          >
            <Text fw={500} className="line-clamp-1">
              {item.name}
            </Text>
            <Text size="sm" color="dimmed" className="mt-2 line-clamp-3">
              {item.prompt}
            </Text>
            <Group className="mt-4 flex items-center">
              <Group>
                <Badge size="md" radius="sm">
                  token: {item.max_tokens}
                </Badge>
                <Badge size="md" radius="sm">
                  temp: {item.temperature}
                </Badge>
                <Badge size="md" radius="sm">
                  logs: {item.max_log}
                </Badge>
              </Group>
            </Group>
            {index !== 0 ? (
              <Group className="flex w-full items-center justify-end">
                <ActionIcon size="sm" onClick={() => onEditAssistant(item)}>
                  <IconPencil />
                </ActionIcon>
              </Group>
            ) : null}
          </Card>
        ))}
      </div>
      <Drawer
        opened={opened}
        onClose={drawerHandler.close}
        size="lg"
        // transitionProps={{ transition: 'slide-left', duration: 150, timingFunction: 'linear' }}
        position="right"
      >
        <AssistantConfig save={saveAssistant} remove={removeAssistant} assistant={editAssistant!} />
      </Drawer>
    </div>
  );
}

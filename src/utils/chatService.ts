import { Message } from '@/types';

type StreamParams = {
  prompt: string;
  history?: Message[];
  options?: {
    temperature?: number;
    max_tokens?: number;
  };
};

type Action = {
  onCompleting: (sug: string) => void;
  onCompleted?: (sug: string) => void;
};

// 單例模式
class ChatService {
  private static instance: ChatService;
  public actions?: Action;
  private controller: AbortController;

  private constructor() {
    this.controller = new AbortController();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public async getStream(params: StreamParams) {
    const { prompt } = params;
    let suggestion = '';
    try {
      const resp = await fetch('api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: this.controller.signal,
      });
      const data = resp.body;
      if (!data) {
        return;
      }
      const reader = data.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      while (!done) {
        const { value, done: doneReadingStream } = await reader.read();
        done = doneReadingStream;
        const chunkValue = decoder.decode(value);
        suggestion += chunkValue;

        this.actions?.onCompleting(suggestion);

        await new Promise((res) => {
          setTimeout(res, 100);
        });
      }
    } catch (error) {
    } finally {
      this.actions?.onCompleted?.(suggestion);
      this.controller = new AbortController();
    }
  }

  public cancel() {
    this.controller.abort();
  }
}

const chatService = ChatService.getInstance();

export default chatService;

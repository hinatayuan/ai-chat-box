// src/services/graphqlClient.ts
import { useState, useCallback } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatInput {
  message: string;
  conversation?: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  success: boolean;
  message: string | null;
  error: string | null;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  timestamp?: string;
}

class GraphQLClient {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async query<T>(query: string, variables?: any): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  }

  async sendMessage(input: ChatInput): Promise<ChatResponse> {
    const query = `
      mutation Chat($input: ChatInput!) {
        chat(input: $input) {
          success
          message
          error
          model
          timestamp
          usage {
            promptTokens
            completionTokens
            totalTokens
          }
        }
      }
    `;

    const response = await this.query<{ chat: ChatResponse }>(query, { input });
    return response.chat;
  }

  async healthCheck(): Promise<any> {
    const query = `
      query {
        health {
          status
          timestamp
          environment
          version
        }
      }
    `;

    return await this.query(query);
  }
}

// 创建客户端实例
const API_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 
  'http://localhost:8787/graphql';

export const graphqlClient = new GraphQLClient(API_ENDPOINT);

// React Hook for easy usage
export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    // 添加用户消息
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // 发送到 GraphQL API
      const response = await graphqlClient.sendMessage({
        message,
        conversation: messages.slice(-10), // 只发送最近10条消息作为上下文
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
      });

      if (response.success && response.message) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response.message,
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError(response.error || '发送消息失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络错误';
      setError(errorMessage);
      console.error('发送消息错误:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
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

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
}

class GraphQLClient {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    // 调试信息：输出端点地址
    console.log('GraphQL 端点:', endpoint);
  }

  async query<T>(query: string, variables?: any): Promise<T> {
    console.log('发送 GraphQL 请求到:', this.endpoint);
    console.log('查询:', query);
    console.log('变量:', variables);

    try {
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

      console.log('响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP 错误:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('GraphQL 响应:', result);

      if (result.errors) {
        console.error('GraphQL 错误:', result.errors);
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      console.error('请求失败:', error);
      throw error;
    }
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

// 调试信息：输出环境变量
console.log('环境变量 REACT_APP_GRAPHQL_ENDPOINT:', process.env.REACT_APP_GRAPHQL_ENDPOINT);
console.log('使用的 API 端点:', API_ENDPOINT);

export const graphqlClient = new GraphQLClient(API_ENDPOINT);

// React Hook for easy usage
export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, settings?: ChatSettings) => {
    if (!message.trim()) return;

    console.log('开始发送消息:', message);
    console.log('设置参数:', settings);

    setIsLoading(true);
    setError(null);

    // 添加用户消息
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // 构建输入参数
      const input: ChatInput = {
        message,
        conversation: messages.slice(-10), // 只发送最近10条消息作为上下文
        model: settings?.model || 'deepseek-chat',
        temperature: settings?.temperature || 0.7,
        maxTokens: settings?.maxTokens || 1000,
      };

      console.log('发送到 API 的输入:', input);

      // 发送到 GraphQL API
      const response = await graphqlClient.sendMessage(input);

      console.log('收到 API 响应:', response);

      if (response.success && response.message) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response.message,
        };

        setMessages(prev => [...prev, aiMessage]);
        console.log('AI 消息已添加:', aiMessage);
      } else {
        const errorMsg = response.error || '发送消息失败';
        console.error('API 返回错误:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络错误';
      console.error('发送消息错误:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('消息发送流程结束');
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    console.log('消息已清空');
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
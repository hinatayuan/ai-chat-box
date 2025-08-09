import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, Trash2, Settings } from 'lucide-react';
import { useChat, ChatMessage } from '../services/graphqlClient';
import MarkdownRenderer from './MarkdownRenderer';

interface Message extends ChatMessage {
  id: string;
  timestamp: Date;
}

const AIChatBox: React.FC = () => {
  const { messages: chatMessages, isLoading, error, sendMessage, clearMessages } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 转换消息格式
  const messages: Message[] = chatMessages.map((msg, index) => ({
    ...msg,
    id: `${msg.role}-${index}`,
    timestamp: new Date(),
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');

    // 自动调整输入框高度
    if (inputRef.current) {
      inputRef.current.style.height = '60px';
    }

    // 调用 GraphQL API
    await sendMessage(message);

    // 重新聚焦输入框
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClearChat = () => {
    clearMessages();
    setInputValue('');
  };

  // 自动调整输入框高度
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = '60px';
    element.style.height = Math.min(element.scrollHeight, 120) + 'px';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustTextareaHeight(e.target);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">AI 助手</h3>
          <p className="text-blue-100 text-sm">由 OpenAI {settings.model} 驱动</p>
        </div>
        
        {/* 设置按钮 */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title="设置"
        >
          <Settings className="w-4 h-4 text-white" />
        </button>
        
        {/* 清空按钮 */}
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        )}
        
        <div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                模型
              </label>
              <select
                value={settings.model}
                onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                创意性: {settings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大令牌数
              </label>
              <input
                type="number"
                min="100"
                max="4000"
                step="100"
                value={settings.maxTokens}
                onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-gray-50 to-white">
        {/* 欢迎消息 */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              欢迎使用 AI 助手
            </h4>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              我可以帮你回答问题、编写代码、提供建议或进行有趣的对话。支持 Markdown 格式输出！
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">代码编程</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">学习辅导</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">创意写作</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">问题解答</span>
            </div>
          </div>
        )}

        {/* 消息列表 */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
              message.role === 'user'
                ? 'bg-blue-500'
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }`}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`flex flex-col max-w-[85%] ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              <div className={`px-5 py-4 rounded-2xl shadow-sm ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
              }`}>
                {message.role === 'user' ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                ) : (
                  <MarkdownRenderer 
                    content={message.content} 
                    className="text-sm leading-relaxed"
                  />
                )}
              </div>
              <span className="text-xs text-gray-500 mt-2 px-2">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-500">AI 正在思考...</span>
              </div>
            </div>
          </div>
        )}

        {/* 错误消息 */}
        {error && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-md">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="bg-red-50 border border-red-200 px-5 py-4 rounded-2xl rounded-bl-md max-w-[85%]">
              <div className="flex items-start gap-2">
                <span className="text-sm text-red-600">{error}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="输入你的消息...（支持 Shift + Enter 换行）"
              className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 min-h-[60px]"
              disabled={isLoading}
              maxLength={2000}
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>按 Enter 发送，Shift + Enter 换行</span>
          <span>{inputValue.length}/2000</span>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
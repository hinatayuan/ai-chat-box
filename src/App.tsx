import AIChatBox from './components/AIChatBox';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 头部标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI 聊天框
          </h1>
          <p className="text-gray-600 text-lg">
            基于 React + TypeScript 的现代化 AI 聊天界面
          </p>
        </div>
        
        {/* 聊天组件 */}
        <AIChatBox />
        
        {/* 底部信息 */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>💡 按 Enter 发送消息，体验智能对话</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              React 18
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              TypeScript
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              Tailwind CSS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
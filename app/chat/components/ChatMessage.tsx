// app/chat/components/ChatMessage.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

interface ChatMessageProps {
  msg: {
    role: string;
    content: string;
  };
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ msg, isUser }) => {
  return (
    <div
      className={`flex mb-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`relative p-3 rounded-xl max-w-[75%] shadow-md ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-700 text-gray-100 rounded-bl-sm'
        }`}
      >
        {msg.role === 'model' && (
          <p className="font-semibold mb-1 text-xs opacity-80">
            Nexo
          </p>
        )}
        <ReactMarkdown
          className="text-sm prose prose-invert max-w-none"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              />
            ),
          }}
        >
          {msg.content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
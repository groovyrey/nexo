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
        className={`relative p-3 rounded-xl max-w-[75%] shadow-md text-sm ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-100 rounded-bl-sm'
        }`}
      >
        {!isUser && ( // Only show "Nexo" for model messages
          <p className="font-semibold mb-1 text-xs opacity-80">
            Nexo
          </p>
        )}
        <ReactMarkdown
          className="prose prose-invert max-w-none break-words" // Added break-words
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline" // Adjusted link color for better contrast
              />
            ),
            p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />, // Adjust paragraph spacing
            li: ({ node, ...props }) => <li className="mb-1 last:mb-0" {...props} />, // Adjust list item spacing
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
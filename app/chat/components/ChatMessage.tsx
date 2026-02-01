import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { FiUser } from 'react-icons/fi'; // Removed FiCpu
import Image from 'next/image'; // Added Image import

interface ChatMessageProps {
  msg: {
    role: string;
    content: string;
    timestamp?: number; // Make timestamp optional
  };
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ msg, isUser }) => {
  const bubbleBg = isUser ? 'bg-blue-600' : 'bg-gray-700';
  const bubbleText = isUser ? 'text-white' : 'text-gray-100';
  const bubbleBorder = isUser ? 'border border-blue-400' : 'border border-gray-600';
  const bubbleShape = isUser ? 'rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md' : 'rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md';
  const align = isUser ? 'justify-end' : 'justify-start';

  const formatTimestamp = (timestamp?: number) => { // Allow timestamp to be optional
    if (!timestamp || isNaN(timestamp)) {
      return ''; // Return empty string or "N/A" for invalid timestamps
    }
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className={`flex items-start gap-3 ${align} animate-fade-in-up`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          <Image src="/nexo.png" alt="Nexo AI" width={32} height={32} />
        </div>
      )}
      <div
        className={`relative p-3 max-w-[75%] ${bubbleBg} ${bubbleText} ${bubbleBorder} ${bubbleShape} font-sans ${!isUser ? 'ai-message' : ''}`}
      >
        <ReactMarkdown
          className="prose prose-invert max-w-none"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 hover:underline"
              />
            ),
            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1 last:mb-0" {...props} />,
            code: ({node, className, children, ...props}) => {
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <div className="bg-gray-900 rounded-md my-2">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-xs">{match[1]}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto font-mono !whitespace-pre">
                    <code className={`!bg-transparent ${className}`} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              ) : (
                <code className="bg-gray-700 rounded-md px-1.5 py-1 text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {msg.content}
        </ReactMarkdown>
        {msg.timestamp && ( // Only render timestamp if it exists
          <div className={`text-xs mt-2 ${isUser ? 'text-right' : 'text-left'} text-gray-400`}>
            {formatTimestamp(msg.timestamp)}
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          <FiUser className="text-white" />
        </div>
      )}
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
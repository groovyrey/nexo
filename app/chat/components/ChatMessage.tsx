import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { FiUser } from 'react-icons/fi';
import Image from 'next/image';

interface ChatMessageProps {
  msg: {
    role: string;
    content: string;
    timestamp?: number;
  };
  isUser: boolean;
  user: any; // It's better to use a more specific type for user
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ msg, isUser, user }) => {
  const bubbleBg = isUser ? 'bg-cyan-500/30' : 'bg-white/10';
  const bubbleText = isUser ? 'text-white' : 'text-gray-100';
  const bubbleBorder = isUser ? 'border border-cyan-500/50' : 'border border-white/20';
  const bubbleShape = isUser ? 'rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md' : 'rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md';
  const align = isUser ? 'justify-end' : 'justify-start';

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp || isNaN(timestamp)) {
      return '';
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
            },
            table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-gray-700" {...props} /></div>,
            thead: ({node, ...props}) => <thead className="bg-white/10" {...props} />,
            th: ({node, ...props}) => <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />,
            tbody: ({node, ...props}) => <tbody className="bg-white/5 divide-y divide-gray-700" {...props} />,
            tr: ({node, ...props}) => <tr className="hover:bg-white/10" {...props} />,
            td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-cyan-500/50 bg-white/5 p-4 my-4" {...props} />,
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-cyan-100 border-b-2 border-cyan-500/50 pb-2" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-4 text-cyan-200 border-b border-cyan-500/50 pb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-3 text-cyan-300" {...props} />,
            h4: ({node, ...props}) => <h4 className="text-lg font-semibold mb-3 text-cyan-400" {...props} />,
            h5: ({node, ...props}) => <h5 className="text-base font-semibold mb-2 text-cyan-500" {...props} />,
            h6: ({node, ...props}) => <h6 className="text-sm font-semibold mb-2 text-cyan-600" {...props} />,
            hr: ({node, ...props}) => <hr className="my-6 border-cyan-500/50" {...props} />,
            img: ({node, ...props}) => <img className="rounded-lg shadow-lg my-4" {...props} />,
            details: ({node, ...props}) => <details className="bg-white/5 rounded-lg border border-white/20 p-4 my-2" {...props} />,
            summary: ({node, ...props}) => <summary className="font-semibold text-cyan-200 cursor-pointer hover:text-cyan-100" {...props} />,
          }}
        >
          {msg.content}
        </ReactMarkdown>
        {msg.timestamp && (
          <div className={`text-xs mt-2 ${isUser ? 'text-right' : 'text-left'} text-gray-400`}>
            {formatTimestamp(msg.timestamp)}
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="User Profile"
              width={32}
              height={32}
            />
          ) : (
            <FiUser className="text-white" />
          )}
        </div>
      )}
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={`markdown-content text-left leading-relaxed text-sm md:text-base space-y-2 ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-xl font-extrabold text-foreground mt-4 mb-2 border-b border-border/40 pb-1.5">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-foreground mt-3 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-extrabold text-primary mt-3 mb-1">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-bold text-foreground mt-2 mb-1">{children}</h4>,
          p: ({ children }) => <p className="mb-2.5 leading-relaxed text-foreground/90">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 mb-3 pl-2 text-foreground/90">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 mb-3 pl-2 text-foreground/90">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed font-normal">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground/85">{children}</em>,
          hr: () => <hr className="my-4 border-border/40" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-3 py-1.5 my-2 bg-primary/5 text-foreground/85 italic rounded-r-lg">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-surface/90 text-primary font-mono text-xs px-1.5 py-0.5 rounded border border-border/40">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-gray max-w-none
      prose-headings:font-bold prose-headings:text-gray-900
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
      prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5
      prose-code:text-sm prose-code:font-normal prose-code:text-gray-800
      prose-code:before:content-none prose-code:after:content-none
      prose-pre:rounded-xl prose-pre:bg-gray-900 prose-pre:p-4
      prose-pre:text-sm prose-img:rounded-lg"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

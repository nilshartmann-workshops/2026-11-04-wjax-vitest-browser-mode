import { marked } from "marked";

type MarkdownProps = {
  className?: string;
  content: string;
};

export default function Markdown({ className, content }: MarkdownProps) {
  const html = marked.parse(content);

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

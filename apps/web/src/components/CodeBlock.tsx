import type { ReactNode } from 'react';

export default function CodeBlock({
  code,
  language,
  children,
}: {
  code?: string;
  language?: string;
  children?: ReactNode;
}) {
  return (
    <div className="site-code-block">
      {language ? (
        <span className="site-code-block__language">{language}</span>
      ) : null}
      <pre>
        <code>{code ?? children}</code>
      </pre>
    </div>
  );
}

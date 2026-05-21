import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { sitePath } from '../lib/site';

const navItems = [
  { href: '', label: 'Home' },
  { href: 'guide/getting-started.html', label: 'Get started' },
  { href: 'api/props.html', label: 'API' },
  { href: 'web.html', label: 'Web Demo' },
  { href: 'guide/expo-snack.html', label: 'Snack Demo' },
] as const;

export default function SiteLayout({
  title,
  description,
  currentPath,
  children,
}: {
  title: string;
  description?: string;
  currentPath: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title =
      title === 'formatted-number-input'
        ? title
        : `${title} | formatted-number-input`;

    if (!description) return;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }, [description, title]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <a className="site-brand" href={sitePath()}>
            formatted-number-input
          </a>

          <nav className="site-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                className={
                  currentPath === item.href
                    ? 'site-nav__link is-active'
                    : 'site-nav__link'
                }
                href={sitePath(item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className="site-github"
            href="https://github.com/brianephraim/formatted-number-input"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="site-main">{children}</main>
    </div>
  );
}

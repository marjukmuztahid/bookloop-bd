import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export const H2 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h2
    id={id}
    className="mt-10 mb-3 scroll-mt-28 text-2xl font-bold tracking-tight text-heading sm:text-[28px]"
  >
    {children}
  </h2>
);

export const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="mt-6 mb-2 text-lg font-semibold text-heading">{children}</h3>
);

export const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-[15px] leading-7 text-body">{children}</p>
);

export const UL = ({ children }: { children: ReactNode }) => (
  <ul className="mb-4 ml-5 list-disc space-y-1.5 text-[15px] leading-7 text-body marker:text-[#E8357A]">
    {children}
  </ul>
);

export const OL = ({ children }: { children: ReactNode }) => (
  <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-[15px] leading-7 text-body marker:text-[#E8357A] marker:font-semibold">
    {children}
  </ol>
);

export const LI = ({ children }: { children: ReactNode }) => <li>{children}</li>;

export const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-heading">{children}</strong>
);

export const A = ({ href, children }: { href: string; children: ReactNode }) => {
  const internal = href.startsWith('/');
  if (internal) {
    return (
      <Link
        to={href}
        className="font-medium text-[#E8357A] underline decoration-[#E8357A]/30 underline-offset-2 transition-colors hover:decoration-[#E8357A]"
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-[#E8357A] underline decoration-[#E8357A]/30 underline-offset-2 transition-colors hover:decoration-[#E8357A]"
    >
      {children}
    </a>
  );
};

export const Callout = ({ children }: { children: ReactNode }) => (
  <aside className="my-6 rounded-2xl border border-[rgba(232,53,122,0.15)] bg-[rgba(232,53,122,0.06)] p-4 text-[14px] leading-6 text-body sm:p-5">
    {children}
  </aside>
);

export const Lead = ({ children }: { children: ReactNode }) => (
  <p className="mb-6 text-[17px] leading-8 text-body">{children}</p>
);

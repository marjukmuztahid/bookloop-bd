import { Facebook, Link2, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
  title: string;
  slug: string;
}

const BASE = 'https://bookloopbd.com';

const ShareButtons = ({ title, slug }: Props) => {
  const [copied, setCopied] = useState(false);
  const url = `${BASE}/blog/${slug}`;
  const text = `${title} — Book Loop BD`;

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // noop
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-medium text-muted-foreground">Share:</span>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-muted-foreground transition-colors hover:bg-[#25D366] hover:text-white"
      >
        <MessageCircle size={16} />
      </a>
      <a
        href={facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-muted-foreground transition-colors hover:bg-[#1877F2] hover:text-white"
      >
        <Facebook size={16} />
      </a>
      <button
        onClick={copy}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-muted-foreground transition-colors hover:bg-[#E8357A] hover:text-white"
      >
        <Link2 size={16} />
      </button>
      {copied && <span className="text-xs text-[#E8357A]">Link copied!</span>}
    </div>
  );
};

export default ShareButtons;

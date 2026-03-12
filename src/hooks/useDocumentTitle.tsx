import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — Book Loop BD` : 'Book Loop BD — Buy & Sell School Books in Bangladesh';
    return () => { document.title = prev; };
  }, [title]);
};

export default useDocumentTitle;

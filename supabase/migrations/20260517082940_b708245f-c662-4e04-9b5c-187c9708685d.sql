
ALTER TABLE public.listings
  ADD COLUMN book_type text NOT NULL DEFAULT 'academic',
  ADD COLUMN genre text;

ALTER TABLE public.listings
  ADD CONSTRAINT listings_book_type_check CHECK (book_type IN ('academic','general')),
  ADD CONSTRAINT listings_genre_check CHECK (
    genre IS NULL OR genre IN (
      'Fiction','Non-fiction','Self-help / Motivational','Religious',
      'Science & Technology','History & Biography','Children''s Books','Comics','Other'
    )
  );

ALTER TABLE public.listings
  ALTER COLUMN curriculum DROP NOT NULL,
  ALTER COLUMN class_level DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_listings_book_type ON public.listings(book_type);

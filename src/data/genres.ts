export const GENRES = [
  'Fiction',
  'Non-fiction',
  'Self-help / Motivational',
  'Religious',
  'Science & Technology',
  'History & Biography',
  "Children's Books",
  'Comics',
  'Other',
] as const;

export type Genre = typeof GENRES[number];

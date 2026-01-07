export const CATEGORIES = ['Cafe', 'Library', 'Study'] as const
export type Category = typeof CATEGORIES[number]
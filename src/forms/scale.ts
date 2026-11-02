import type { Answer } from './types';

export const scored = (labels: readonly string[], scores: readonly number[]): Answer[] => {
  if (labels.length !== scores.length) {
    throw new Error(`Expected ${labels.length} scores, got ${scores.length}`);
  }
  return labels.map((label, index) => ({ label, score: scores[index] as number }));
};

export const responseKey = (questionIndex: number) => `q${questionIndex + 1}`;

export const totalScore = (responses: Readonly<Record<string, number>>) =>
  Object.values(responses).reduce((sum, score) => sum + score, 0);

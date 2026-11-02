import { describe, expect, it } from 'vitest';
import { exeForm } from '../exe';
import { hadForm } from '../had';
import { responseKey, scored, totalScore } from '../scale';
import type { FormDefinition, Responses } from '../types';

const pick = (form: FormDefinition, choose: (scores: number[]) => number): Responses =>
  Object.fromEntries(
    form.questions.map((question, index) => [responseKey(index), choose(question.answers.map((a) => a.score))]),
  );

const scoreOf = (form: FormDefinition, questionIndex: number, label: string) =>
  form.questions[questionIndex]?.answers.find((answer) => answer.label === label)?.score;

describe('totalScore', () => {
  it('sums the chosen scores', () => {
    expect(totalScore({ q1: 3, q2: 0, q3: 2 })).toBe(5);
  });

  it('is zero with no answers', () => {
    expect(totalScore({})).toBe(0);
  });
});

describe('HAD scale', () => {
  it('has 14 questions keyed q1 to q14', () => {
    expect(hadForm.questions).toHaveLength(14);
    expect(Object.keys(pick(hadForm, () => 0))).toEqual(Array.from({ length: 14 }, (_, i) => `q${i + 1}`));
  });

  it('scores every answer from 0 to 3', () => {
    expect(totalScore(pick(hadForm, (scores) => Math.min(...scores)))).toBe(0);
    expect(totalScore(pick(hadForm, (scores) => Math.max(...scores)))).toBe(42);
  });

  it('reverse-scores the positively worded items', () => {
    expect(scoreOf(hadForm, 0, 'All of the time')).toBe(3);
    expect(scoreOf(hadForm, 1, 'Definitely as much')).toBe(0);
    expect(scoreOf(hadForm, 1, 'Hardly at all')).toBe(3);
    expect(scoreOf(hadForm, 13, 'Often')).toBe(0);
  });

  it('totals the first answer of every question', () => {
    expect(totalScore(pick(hadForm, (scores) => scores[0] ?? 0))).toBe(24);
  });
});

describe('Exercise + Confidence scale', () => {
  it('has 8 questions scored from 5 down to 1', () => {
    expect(exeForm.questions).toHaveLength(8);
    for (const question of exeForm.questions) {
      expect(question.answers.map((answer) => answer.score)).toEqual([5, 4, 3, 2, 1]);
    }
  });

  it('totals between 8 and 40', () => {
    expect(totalScore(pick(exeForm, (scores) => Math.min(...scores)))).toBe(8);
    expect(totalScore(pick(exeForm, (scores) => Math.max(...scores)))).toBe(40);
  });

  it('totals a mixed set of answers', () => {
    expect(totalScore({ q1: 5, q2: 4, q3: 3, q4: 2, q5: 1, q6: 5, q7: 4, q8: 3 })).toBe(27);
  });
});

describe('scored', () => {
  it('rejects a scale whose scores do not match its labels', () => {
    expect(() => scored(['Yes', 'No'], [1])).toThrow('Expected 2 scores, got 1');
  });
});

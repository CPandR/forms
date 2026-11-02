import { scored } from './scale';
import type { FormDefinition } from './types';

const FORWARD = [3, 2, 1, 0];
const REVERSE = [0, 1, 2, 3];

export const hadForm: FormDefinition = {
  pageTitle: 'HADS | CP+R',
  heading: 'HAD Scale Form',
  intro: [
    'Here at CP+R® we are aware that emotions and how you feel play an important part in your overall health. Knowing more about how you feel will ensure that we are able to help you as effectively as possible. Read each item and tick the box that comes closest to how you have been feeling in the past week.',
    'Don’t take too long over your replies; your immediate reaction to each item will probably be more accurate than a long thought-out response.',
  ],
  validateEndpoint: 'validate_had_link',
  submitEndpoint: 'submit_had_form',
  questions: [
    {
      title: 'I feel tense or wound up',
      answers: scored(['All of the time', 'A lot of the time', 'Occasionally', 'Not at all'], FORWARD),
    },
    {
      title: 'I still enjoy the things I used to enjoy',
      answers: scored(['Definitely as much', 'Not quite so much', 'Only a little', 'Hardly at all'], REVERSE),
    },
    {
      title: 'I get a sort of frightened feeling as if something awful is about to happen',
      answers: scored(
        ['Very definitely and quite badly', 'Yes, but not too badly', 'A little, but it doesn’t worry me', 'Not at all'],
        FORWARD,
      ),
    },
    {
      title: 'I can laugh and see the funny side of things',
      answers: scored(
        ['As much as I always could', 'Not quite so much now', 'Definitely not so much now', 'Not at all'],
        REVERSE,
      ),
    },
    {
      title: 'Worrying thoughts go through my mind',
      answers: scored(['All of the time', 'A lot of the time', 'From time to time', 'Only occasionally'], FORWARD),
    },
    {
      title: 'I feel cheerful',
      answers: scored(['Not at all', 'Not often', 'Sometimes', 'Most of the time'], FORWARD),
    },
    {
      title: 'I can sit at ease and feel relaxed',
      answers: scored(['Definitely', 'Usually', 'Not often', 'Not at all'], REVERSE),
    },
    {
      title: 'I feel as if I am slowed down',
      answers: scored(['All the time', 'Often', 'Sometimes', 'Not at all'], FORWARD),
    },
    {
      title: 'I get a sort of frightened feeling like “butterflies” in the stomach',
      answers: scored(['Not at all', 'Occasionally', 'Quite often', 'All the time'], REVERSE),
    },
    {
      title: 'I have lost interest and put less effort into my appearance',
      answers: scored(['Definitely', 'Often', 'Sometimes', 'I take just as much care as ever'], FORWARD),
    },
    {
      title: 'I feel restless as if I have to be on the move',
      answers: scored(['Very much indeed', 'Quite a lot', 'Not very much', 'Not at all'], FORWARD),
    },
    {
      title: 'I look forward with enjoyment to things',
      answers: scored(
        ['As much as I ever did', 'Rather less than I used to', 'Definitely less than I used to', 'Hardly at all'],
        REVERSE,
      ),
    },
    {
      title: 'I get sudden feelings of panic',
      answers: scored(['All the time', 'Quite often', 'Not very often', 'Not at all'], FORWARD),
    },
    {
      title: 'I can relax and enjoy a good book or radio or TV programme',
      answers: scored(['Often', 'Sometimes', 'Not often', 'Rarely'], REVERSE),
    },
  ],
};

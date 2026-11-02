import { scored } from './scale';
import type { FormDefinition } from './types';

const SCORES = [5, 4, 3, 2, 1];
const RATING = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
const SEVERITY = ['Not at all', 'Slightly', 'Moderate', 'Quite a bit', 'Extremely'];

export const exeForm: FormDefinition = {
  pageTitle: 'Exercise + Confidence | CP+R',
  heading: 'Exercise + Confidence Form',
  intro: [
    'Knowing more about how you feel about right now will ensure that we are able to help you more effectively during your programme.',
    'Read each item and tick the box that comes closest to how you have been feeling in the past 2 weeks. Don’t take too long over your replies; your immediate reaction to each item will probably be more accurate than a long thought-out response.',
  ],
  validateEndpoint: 'validate_exe_link',
  submitEndpoint: 'submit_exe_form',
  questions: [
    {
      title: 'How confident do you feel about exercising?',
      answers: scored(RATING, SCORES),
    },
    {
      title: 'How would you rate your overall general confidence level?',
      answers: scored(RATING, SCORES),
    },
    {
      title: 'How would you rate your current overall health?',
      answers: scored(RATING, SCORES),
    },
    {
      title: 'How much of your time do you focus specifically on your health?',
      answers: scored(['All', 'A lot', 'Some', 'Not Much', 'None'], SCORES),
    },
    {
      title: 'What is the hardest physical activity you could do for at least 30 minutes?',
      answers: scored(
        [
          'Very heavy e.g. Fast walk up a slight hill/jog/fast cycle',
          'Heavy e.g. Fast walk',
          'Moderate e.g. Medium pace walk up hill',
          'Light e.g. Medium pace walk',
          'Very Light e.g. Slow walk or less',
        ],
        SCORES,
      ),
    },
    {
      title: 'When walking up stairs, how many flights could you do continuously before feeling out of breath?',
      answers: scored(['4 or more', '3', '2', '1', 'None'], SCORES),
    },
    {
      title:
        'How much are you bothered by stress, emotional problems such as feeling anxious, depressed, irritable or sad?',
      answers: scored(SEVERITY, SCORES),
    },
    {
      title: 'Does your physical or emotional health limit your social activities with family and friends?',
      answers: scored(SEVERITY, SCORES),
    },
  ],
};

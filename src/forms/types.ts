export type Answer = {
  label: string;
  score: number;
};

export type Question = {
  title: string;
  answers: readonly Answer[];
};

export type FormDefinition = {
  pageTitle: string;
  heading: string;
  intro: readonly string[];
  questions: readonly Question[];
  validateEndpoint: string;
  submitEndpoint: string;
};

export type Responses = Record<string, number>;

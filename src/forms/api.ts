import { totalScore } from './scale';
import type { FormDefinition, Responses } from './types';

export type LinkStatus = 'open' | 'submitted' | 'invalid';

const endpoint = (path: string, id: string) => `${import.meta.env.VITE_API_URL}/${path}/${encodeURIComponent(id)}`;

export const validateLink = async (form: FormDefinition, id: string): Promise<LinkStatus> => {
  try {
    const response = await fetch(endpoint(form.validateEndpoint, id));
    if (response.status === 202) return 'open';
    if (response.status === 409) return 'submitted';
    return 'invalid';
  } catch {
    return 'invalid';
  }
};

export const submitResponses = async (form: FormDefinition, id: string, responses: Responses): Promise<boolean> => {
  try {
    const response = await fetch(endpoint(form.submitEndpoint, id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total: totalScore(responses), form_responses: responses }),
    });
    return response.status === 201;
  } catch {
    return false;
  }
};

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { exeForm } from '../../forms/exe';
import { hadForm } from '../../forms/had';
import type { FormDefinition } from '../../forms/types';
import { INVALID_LINK_MESSAGE, QuestionnairePage, SUBMIT_ERROR_MESSAGE } from '../QuestionnairePage';

const API = 'https://hub.test/api/forms';

const respond = (...statuses: number[]) => {
  const fetchMock = vi.fn();
  for (const status of statuses) {
    fetchMock.mockResolvedValueOnce(new Response(null, { status }));
  }
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const answerEveryQuestion = async (form: FormDefinition, labelIndex: number) => {
  const user = userEvent.setup();
  for (const question of form.questions) {
    const group = screen.getByRole('group', { name: question.title });
    const answer = question.answers[labelIndex];
    if (!answer) throw new Error(`No answer ${labelIndex} for ${question.title}`);
    await user.click(within(group).getByRole('radio', { name: answer.label }));
  }
  return user;
};

describe.each([
  { form: hadForm, validate: 'validate_had_link', submit: 'submit_had_form' },
  { form: exeForm, validate: 'validate_exe_link', submit: 'submit_exe_form' },
])('QuestionnairePage for $form.heading', ({ form, validate, submit }) => {
  it('shows the form when the link is open (202)', async () => {
    const fetchMock = respond(202);

    render(<QuestionnairePage form={form} id="abc123" />);

    expect(await screen.findByRole('heading', { name: form.heading })).toBeInTheDocument();
    expect(screen.getAllByRole('group')).toHaveLength(form.questions.length);
    expect(fetchMock).toHaveBeenCalledWith(`${API}/${validate}/abc123`);
    expect(document.title).toBe(form.pageTitle);
  });

  it('shows the thank-you page when the form was already submitted (409)', async () => {
    respond(409);

    render(<QuestionnairePage form={form} id="abc123" />);

    expect(await screen.findByRole('heading', { name: 'Thank you.' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit Form' })).not.toBeInTheDocument();
  });

  it.each([404, 500, 200])('shows the error page for any other status (%i)', async (status) => {
    respond(status);

    render(<QuestionnairePage form={form} id="abc123" />);

    expect(await screen.findByText(INVALID_LINK_MESSAGE)).toBeInTheDocument();
  });

  it('shows the error page when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    render(<QuestionnairePage form={form} id="abc123" />);

    expect(await screen.findByText(INVALID_LINK_MESSAGE)).toBeInTheDocument();
  });

  it('posts the total and responses, then thanks the patient (201)', async () => {
    const fetchMock = respond(202, 201);
    render(<QuestionnairePage form={form} id="abc123" />);
    await screen.findByRole('heading', { name: form.heading });

    const user = await answerEveryQuestion(form, 0);
    await user.click(screen.getByRole('button', { name: 'Submit Form' }));

    expect(await screen.findByRole('heading', { name: 'Thank you.' })).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[1] ?? [];
    expect(url).toBe(`${API}/${submit}/abc123`);
    expect(init).toMatchObject({ method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const responses = Object.fromEntries(form.questions.map((q, i) => [`q${i + 1}`, q.answers[0]?.score]));
    const total = Object.values(responses).reduce((sum: number, score) => sum + (score ?? 0), 0);
    expect(JSON.parse(init.body)).toEqual({ total, form_responses: responses });
  });

  it.each([
    ['a non-201 status', () => respond(202, 500)],
    [
      'a network failure',
      () =>
        vi.stubGlobal(
          'fetch',
          vi
            .fn()
            .mockResolvedValueOnce(new Response(null, { status: 202 }))
            .mockRejectedValueOnce(new TypeError('Failed to fetch')),
        ),
    ],
  ])('keeps the answers and shows an error notification after %s', async (_name, arrange) => {
    arrange();
    render(<QuestionnairePage form={form} id="abc123" />);
    await screen.findByRole('heading', { name: form.heading });

    const user = await answerEveryQuestion(form, 1);
    await user.click(screen.getByRole('button', { name: 'Submit Form' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(SUBMIT_ERROR_MESSAGE);
    expect(screen.getByRole('button', { name: 'Submit Form' })).toBeEnabled();
    const firstAnswer = form.questions[0]?.answers[1]?.label ?? '';
    expect(screen.getAllByRole('radio', { name: firstAnswer })[0]).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });
});

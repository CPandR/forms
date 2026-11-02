import { type FormEvent, useEffect, useState } from 'react';
import { ErrorNotification } from '../components/ErrorNotification';
import { ErrorPage } from '../components/ErrorPage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RadioInput } from '../components/RadioInput';
import { SubmitButton } from '../components/SubmitButton';
import { SuccessPage } from '../components/SuccessPage';
import { type LinkStatus, submitResponses, validateLink } from '../forms/api';
import { responseKey } from '../forms/scale';
import type { FormDefinition, Responses } from '../forms/types';

export const INVALID_LINK_MESSAGE =
  'We were unable to find a form linked to this URL. Please contact your Cardiac Coach if this problem persists.';

export const SUBMIT_ERROR_MESSAGE =
  'There was an error submitting your form. Please contact your Cardiac Coach if this error persists.';

type QuestionnairePageProps = {
  form: FormDefinition;
  id: string;
};

export const QuestionnairePage = ({ form, id }: QuestionnairePageProps) => {
  const [status, setStatus] = useState<LinkStatus | 'loading'>('loading');
  const [responses, setResponses] = useState<Responses>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  useEffect(() => {
    document.title = form.pageTitle;
  }, [form]);

  useEffect(() => {
    let active = true;
    validateLink(form, id).then((result) => {
      if (active) setStatus(result);
    });
    return () => {
      active = false;
    };
  }, [form, id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitFailed(false);
    const saved = await submitResponses(form, id, responses);
    setSubmitting(false);
    if (saved) {
      setStatus('submitted');
    } else {
      setSubmitFailed(true);
    }
  };

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'submitted') return <SuccessPage />;
  if (status === 'invalid') return <ErrorPage message={INVALID_LINK_MESSAGE} />;

  return (
    <div className="container mx-auto mt-1">
      <h1 className="text-3xl font-bold">{form.heading}</h1>
      <div className="my-3">
        {form.intro.map((paragraph, index) => (
          <p key={paragraph} className={index === form.intro.length - 1 ? 'mb-5' : 'mb-3'}>
            {paragraph}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {form.questions.map((question, questionIndex) => {
          const key = responseKey(questionIndex);
          return (
            <fieldset key={key} className="mb-7">
              <legend className="text-2xl font-bold">{question.title}</legend>
              {question.answers.map((answer) => (
                <RadioInput
                  key={answer.label}
                  name={key}
                  label={answer.label}
                  checked={responses[key] === answer.score}
                  onSelect={() => setResponses((current) => ({ ...current, [key]: answer.score }))}
                />
              ))}
            </fieldset>
          );
        })}
        <SubmitButton submitting={submitting} />
      </form>
      {submitFailed && <ErrorNotification message={SUBMIT_ERROR_MESSAGE} onDismiss={() => setSubmitFailed(false)} />}
    </div>
  );
};

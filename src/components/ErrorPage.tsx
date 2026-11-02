import { CenteredMessage } from './CenteredMessage';

export const WRONG_TURN_MESSAGE =
  "It looks like you've taken a wrong turn. If you were expecting to submit a form, please try following the link sent via email again or contact your Cardiac Coach.";

export const ErrorPage = ({ message = WRONG_TURN_MESSAGE }: { message?: string }) => (
  <CenteredMessage>
    <h1 className="mb-4 text-5xl font-bold">Uh oh!</h1>
    <p className="max-w-[800px] text-[1.1rem]">{message}</p>
  </CenteredMessage>
);

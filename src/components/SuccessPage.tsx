import { CenteredMessage } from './CenteredMessage';

export const SuccessPage = () => (
  <CenteredMessage>
    <h1 className="mb-1 text-5xl font-bold">Thank you.</h1>
    <p className="max-w-[800px] text-[1.1rem]/8">Your response has been saved</p>
  </CenteredMessage>
);

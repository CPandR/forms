import { Spinner } from './Spinner';

export const SubmitButton = ({ submitting }: { submitting: boolean }) => (
  <button
    className={`${submitting ? 'bg-black text-white ' : ''}mb-7 flex cursor-pointer items-center justify-center px-3 py-1.5 text-lg outline-1 transition duration-300 ease-in-out hover:bg-black hover:text-white hover:ease-in focus:bg-black focus:text-white focus:ring-3 focus:ring-blue-300`}
    type="submit"
    style={{ width: 'calc(12ch + 1.75rem)' }}
    aria-label="Submit Form"
    disabled={submitting}
  >
    {submitting ? 'Submitting' : 'Submit'}
    {submitting && <Spinner className="ml-2 h-5 w-5 border-2 text-white" />}
  </button>
);

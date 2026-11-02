type ErrorNotificationProps = {
  message: string;
  onDismiss: () => void;
};

export const ErrorNotification = ({ message, onDismiss }: ErrorNotificationProps) => (
  <div className="fixed top-0 right-0 m-2" role="alert">
    <div className="bg-red-500 text-white">
      <hr className="border-gray-200" />
      <div className="p-4">
        <button className="cursor-pointer" type="button" aria-label="Dismiss" onClick={onDismiss}>
          x
        </button>{' '}
        {message}
      </div>
    </div>
  </div>
);

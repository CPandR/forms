import type { ReactNode } from 'react';

export const CenteredMessage = ({ children }: { children: ReactNode }) => (
  <div className="absolute top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
    {children}
  </div>
);

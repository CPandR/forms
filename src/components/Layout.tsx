import { Outlet } from 'react-router';

export const Layout = () => (
  <div className="mx-auto max-w-4xl p-4">
    <img src="/images/CPR-Logo_Yellow.png" alt="CP+R" className="mb-2 w-36 object-scale-down" />
    <Outlet />
  </div>
);

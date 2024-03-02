import {
  createRootRoute,
  Link,
  Outlet,
  Navigate,
} from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className={'m-2 flex gap-2'}>
        <Link to={'/'} className={'[&.active]:font-bold'}>
          Home
        </Link>
        <Link to={'/about'} className={'[&.active]:font-bold'}>
          About
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
  notFoundComponent: () => <Navigate to={'/'} />,
});

import { Outlet, createRootRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '../contexts/AuthContext'

function RootComponent() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if not on login page and not authenticated
    if (!isLoading && !isAuthenticated && location.pathname !== '/') {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <RootComponent />
    </AuthProvider>
  ),
})
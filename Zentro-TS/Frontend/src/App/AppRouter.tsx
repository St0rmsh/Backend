import { useRoutes } from 'react-router-dom';
import { routes } from '../router';

/**
 * App Router Component
 * Renders all application routes using useRoutes hook
 */
export function AppRouter() {
  return useRoutes(routes);
}

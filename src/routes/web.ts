// Route definitions (Laravel-like structure)
export const routes = {
  // Public routes
  home: '/',
  auth: '/auth',
  
  // Protected routes
  dashboard: '/dashboard',
  modeSelection: '/mode-selection',
  practice: '/practice',
  profile: '/profile',
  stats: '/stats',
  survey: '/survey',
  
  // Admin routes
  admin: '/admin',
  
  // Error pages
  notFound: '/404'
};

export const routeNames = {
  home: 'home',
  auth: 'auth',
  dashboard: 'dashboard',
  modeSelection: 'mode-selection',
  practice: 'practice',
  profile: 'profile',
  stats: 'stats',
  survey: 'survey',
  admin: 'admin',
  notFound: 'not-found'
};

// Middleware-like checks
export const middleware = {
  auth: (user: any) => !!user,
  admin: (user: any) => user?.role === 'admin',
  guest: (user: any) => !user
};
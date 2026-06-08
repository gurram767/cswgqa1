/**
 * Centralized application routes.
 * Keep every path here so URL changes are a one-line edit, not a find-and-replace.
 */
export const Routes = {
  login: '/customerportal/#/login',
  // The authenticated landing page the app redirects to after a successful login.
  home: '/customerportal/#/home',
  dashboard: '/customerportal/#/dashboard',
  reports: '/customerportal/#/reports/adreports',
} as const;

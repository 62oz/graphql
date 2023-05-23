export function redirectToDashboard() {
  return window.location.replace('/dashboard');
}

export function redirectToLogin() {
    return window.location.replace('/login');
}

export function pageNotFound() {
    return window.location.replace('/404');
}

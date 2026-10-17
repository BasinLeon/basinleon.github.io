// Dashboard-only mirror of the last authenticated cross-site opt-out result.
// This record never controls analytics collection on the public site.
const KEY = 'lb:insights:owner-confirmation:v1';

export function readOwnerConfirmation() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch (_) {
    return false;
  }
}

export function saveOwnerConfirmation(excluded) {
  try {
    if (excluded) localStorage.setItem(KEY, '1');
    else localStorage.removeItem(KEY);
  } catch (_) {
    // A blocked store must not interrupt verification or imply persistence.
  }
}

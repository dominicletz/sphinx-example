import service from './service';

export function restoreSession() {
  const options = {
    headers: { Authorization: undefined } // don't send the Authorization header
  };
  return service.get(`/session?cacheBuster=${Math.random()}`, options);
}

export default {
  restoreSession,
};

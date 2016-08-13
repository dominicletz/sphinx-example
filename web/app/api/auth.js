import service from './service';

export function login(email, password) {
  return service.post('/session', { email, password });
}

export function signup(email, password) {
  return service.put(`/user/${email}`, { password });
}

export default {
  login,
  signup,
};

import auth from './auth';
import lightbulbs from './lightbulbs';
import service from './service';
import session from './session';

export default {
  ...auth,
  ...lightbulbs,
  service,
  ...session,
};

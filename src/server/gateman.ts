import { Gateman } from '@random-guys/gateman';
import redis from '@app/common/services/redis';
import env from '@app/common/config/env';
import Iris from '@random-guys/iris';

const authScheme = 'GoMoney';

Iris.bootstrap(env.service_name, authScheme);

export default new Gateman({
  service: env.service_name,
  authScheme,
  redis,
  secret: env.gateman_key,
});

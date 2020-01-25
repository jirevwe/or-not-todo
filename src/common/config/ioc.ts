import 'module-alias/register';

import { Container } from 'inversify';

// import controllers
import '../../server/controllers';

const container = new Container();

export default container;

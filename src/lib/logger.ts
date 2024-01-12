import logger, { LogLevel, type FactoryLevels } from 'loglevelnext';
import { dev } from '$app/environment';

if (dev) {
  logger.enable();
}

logger.level = 'DEBUG';

type ConsoleLogging = Pick<Console, 'trace' | 'debug' | 'info' | 'warn' | 'error'>;

// Dirty hacks....
export const log = logger.create('root') as LogLevel<FactoryLevels> & ConsoleLogging;

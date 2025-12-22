const pino = require('pino');

const isProd = process.env.NODE_ENV === 'production';
const level = process.env.LOG_LEVEL || (isProd ? 'info' : 'debug');

let destination;
if (isProd && process.env.LOG_FILE) {
  destination = pino.destination(process.env.LOG_FILE);
}

const logger = pino(
  {
    level,
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      err: pino.stdSerializers.err,
    },
  },
  destination
);

module.exports = logger;

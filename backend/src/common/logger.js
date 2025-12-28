const pino = require('pino');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const isProd = process.env.NODE_ENV === 'production';
const level = process.env.LOG_LEVEL || (isProd ? 'info' : 'debug');

function createRotatingStream() {
  const logDir = process.env.LOG_DIR || path.resolve(__dirname, '../../logs');
  try {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  } catch {
    return null;
  }

  const LOG_ROTATION_SIZE = process.env.LOG_ROTATION_SIZE || '10M';
  const LOG_ROTATION_INTERVAL = process.env.LOG_ROTATION_INTERVAL || '1d';
  const LOG_MAX_FILES = parseInt(process.env.LOG_MAX_FILES || '30', 10);

  const fileNameGenerator = (time, index) => {
    if (!time) return 'app.log';
    const date = new Date(time).toISOString().slice(0, 10);
    return (index && index > 0) ? `app-${date}-${index}.log` : `app-${date}.log`;
  };

  const stream = rfs.createStream(fileNameGenerator, {
    size: LOG_ROTATION_SIZE,
    interval: LOG_ROTATION_INTERVAL,
    path: logDir,
    maxFiles: LOG_MAX_FILES
  });

  return stream;
}

let logger;

if (!isProd) {
  const transport = pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  });

  logger = pino({ level, base: null, timestamp: pino.stdTimeFunctions.isoTime, serializers: { err: pino.stdSerializers.err } }, transport);
} else {
  const stream = createRotatingStream();
  if (stream) {
    logger = pino({ level, base: null, timestamp: pino.stdTimeFunctions.isoTime, serializers: { err: pino.stdSerializers.err } }, stream);
  } else {
    logger = pino({ level, base: null, timestamp: pino.stdTimeFunctions.isoTime, serializers: { err: pino.stdSerializers.err } });
  }
}

module.exports = logger;

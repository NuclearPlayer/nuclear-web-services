import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

const env = process.env.NODE_ENV || 'development';

const logger = winston.createLogger({
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [new winston.transports.Console({ silent: env == 'test' })],
});

export default logger;

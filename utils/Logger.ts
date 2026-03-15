/**
 * Logger — lightweight logger with timestamps and log levels.
 */
export class Logger {
  private readonly context: string;

  private static readonly LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  } as const;

  private static currentLevel: number = Logger.LEVELS.INFO;

  constructor(context: string) {
    this.context = context;
  }

  /** Set the minimum log level */
  static setLevel(level: keyof typeof Logger.LEVELS): void {
    Logger.currentLevel = Logger.LEVELS[level];
  }

  private log(level: keyof typeof Logger.LEVELS, message: string, data?: unknown): void {
    if (Logger.LEVELS[level] < Logger.currentLevel) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}] [${this.context}]`;

    const logMessage = data
      ? `${prefix} ${message} ${JSON.stringify(data, null, 2)}`
      : `${prefix} ${message}`;

    switch (level) {
      case 'ERROR':
        console.error(logMessage);
        break;
      case 'WARN':
        console.warn(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  /** Log a debug message */
  debug(message: string, data?: unknown): void {
    this.log('DEBUG', message, data);
  }

  /** Log an info message */
  info(message: string, data?: unknown): void {
    this.log('INFO', message, data);
  }

  /** Log a warning */
  warn(message: string, data?: unknown): void {
    this.log('WARN', message, data);
  }

  /** Log an error */
  error(message: string, data?: unknown): void {
    this.log('ERROR', message, data);
  }

  /** Log the start of a test step */
  step(stepName: string): void {
    this.info(`▶ STEP: ${stepName}`);
  }

  /** Log test step completion */
  stepDone(stepName: string): void {
    this.info(`✔ DONE: ${stepName}`);
  }
}

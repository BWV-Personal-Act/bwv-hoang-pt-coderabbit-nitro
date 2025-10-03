enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

const Colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',

  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  FgGray: '\x1b[90m',
};

interface LoggerOptions {
  enableTimestamp?: boolean;
  enableColors?: boolean;
  prefix?: string;
  minLevel?: LogLevel;
}

class Logger {
  private readonly options: Required<LoggerOptions>;
  private readonly levelPriority: Record<LogLevel, number> = {
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.SUCCESS]: 2,
    [LogLevel.WARN]: 3,
    [LogLevel.ERROR]: 4,
  };

  constructor(options: LoggerOptions = {}) {
    this.options = {
      enableTimestamp: options.enableTimestamp ?? true,
      enableColors: options.enableColors ?? true,
      prefix: options.prefix ?? '',
      minLevel: options.minLevel ?? LogLevel.DEBUG,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return (
      this.levelPriority[level] >= this.levelPriority[this.options.minLevel]
    );
  }

  private colorize(text: string, color: string): string {
    if (!this.options.enableColors) return text;
    return `${color}${text}${Colors.Reset}`;
  }

  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  private formatPrefix(level: LogLevel, color: string): string {
    const parts: string[] = [];

    if (this.options.enableTimestamp) {
      parts.push(this.colorize(this.getTimestamp(), Colors.FgGray));
    }

    if (this.options.prefix) {
      parts.push(this.colorize(`[${this.options.prefix}]`, Colors.FgCyan));
    }

    parts.push(this.colorize(`[${level}]`, color));

    return parts.join(' ');
  }

  debug(...args: any[]): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const prefix = this.formatPrefix(LogLevel.DEBUG, Colors.FgBlue);
    console.log(prefix, ...args);
  }

  info(...args: any[]): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const prefix = this.formatPrefix(LogLevel.INFO, Colors.FgCyan);
    console.info(prefix, ...args);
  }

  success(...args: any[]): void {
    if (!this.shouldLog(LogLevel.SUCCESS)) return;
    const prefix = this.formatPrefix(LogLevel.SUCCESS, Colors.FgGreen);
    console.log(prefix, ...args);
  }

  warn(...args: any[]): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const prefix = this.formatPrefix(LogLevel.WARN, Colors.FgYellow);
    console.warn(prefix, ...args);
  }

  error(...args: any[]): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const prefix = this.formatPrefix(LogLevel.ERROR, Colors.FgRed);
    console.error(prefix, ...args);
  }

  json(obj: any, level: LogLevel = LogLevel.INFO): void {
    if (!this.shouldLog(level)) return;
    const prefix = this.formatPrefix(level, Colors.FgMagenta);
    console.log(prefix, JSON.stringify(obj, null, 2));
  }

  table(data: any[], level: LogLevel = LogLevel.INFO): void {
    if (!this.shouldLog(level)) return;
    const prefix = this.formatPrefix(level, Colors.FgCyan);
    console.log(prefix);
    console.table(data);
  }

  group(title: string, callback: () => void): void {
    console.group(this.colorize(title, Colors.Bright));
    callback();
    console.groupEnd();
  }
}

export const logger = new Logger();

export { Logger, LogLevel };
export type { LoggerOptions };

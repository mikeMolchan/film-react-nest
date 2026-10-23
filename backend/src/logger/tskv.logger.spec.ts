import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('разделяет поля табуляцией и записывает их как key=value', () => {
      const result = logger.formatMessage('log', 'Сервер запущен', 'App');

      expect(result).toBe(
        'level=log\tmessage=Сервер запущен\toptionalParams=App',
      );
    });

    it('склеивает несколько дополнительных параметров через запятую', () => {
      const result = logger.formatMessage('error', 'Ошибка', 'stack', 'App');

      expect(result).toBe('level=error\tmessage=Ошибка\toptionalParams=stack,App');
    });

    it('оставляет optionalParams пустым, если параметров нет', () => {
      const result = logger.formatMessage('log', 'Сообщение');

      expect(result).toBe('level=log\tmessage=Сообщение\toptionalParams=');
    });

    it('превращает объект в строку JSON, так как формат хранит только строки', () => {
      const result = logger.formatMessage('log', { id: 1 });

      expect(result).toBe('level=log\tmessage={"id":1}\toptionalParams=');
    });

    it('превращает число в строку', () => {
      const result = logger.formatMessage('log', 10);

      expect(result).toBe('level=log\tmessage=10\toptionalParams=');
    });

    it('не содержит перевода строки внутри записи', () => {
      const result = logger.formatMessage('log', 'a', 'b');

      expect(result).not.toContain('\n');
    });
  });

  describe('экранирование спецсимволов', () => {
    it('экранирует перенос строки внутри значения', () => {
      const result = logger.formatMessage('error', 'Ошибка', 'строка1\nстрока2');

      expect(result).not.toContain('\n');
      expect(result).toContain('optionalParams=строка1\\nстрока2');
    });

    it('экранирует табуляцию внутри значения, чтобы не создать лишнее поле', () => {
      const result = logger.formatMessage('log', 'до\tпосле');

      expect(result.split('\t')).toHaveLength(3);
      expect(result).toContain('message=до\\tпосле');
    });

    it('экранирует возврат каретки', () => {
      const result = logger.formatMessage('log', 'a\rb');

      expect(result).toContain('message=a\\rb');
    });

    it('экранирует обратный слеш', () => {
      const result = logger.formatMessage('log', 'a\\b');

      expect(result).toContain('message=a\\\\b');
    });
  });

  describe('вывод в консоль', () => {
    it.each([
      ['log', 'log'],
      ['warn', 'warn'],
      ['error', 'error'],
      ['debug', 'debug'],
      ['verbose', 'debug'],
      ['fatal', 'error'],
    ] as const)(
      'метод %s пишет запись с уровнем %s в нужный поток консоли',
      (method, consoleMethod) => {
        const spy = jest.spyOn(console, consoleMethod).mockImplementation();

        logger[method]('Сообщение', 'Context');

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(
          `level=${method}\tmessage=Сообщение\toptionalParams=Context`,
        );
      },
    );
  });
});
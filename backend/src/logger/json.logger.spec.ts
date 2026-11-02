import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('возвращает JSON-строку с полями level, message и optionalParams', () => {
      const result = logger.formatMessage('log', 'Сервер запущен', 'App');

      expect(JSON.parse(result)).toEqual({
        level: 'log',
        message: 'Сервер запущен',
        optionalParams: ['App'],
      });
    });

    it('передает дополнительные параметры массивом без вложенности', () => {
      const result = logger.formatMessage('error', 'Ошибка', 'stack', 'App');

      expect(JSON.parse(result).optionalParams).toEqual(['stack', 'App']);
    });

    it('возвращает пустой массив optionalParams, если параметров нет', () => {
      const result = logger.formatMessage('log', 'Сообщение');

      expect(JSON.parse(result).optionalParams).toEqual([]);
    });

    it('сохраняет тип значений: объект остается объектом', () => {
      const result = logger.formatMessage('log', { id: 1, tags: ['a'] });

      expect(JSON.parse(result).message).toEqual({ id: 1, tags: ['a'] });
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
      'метод %s пишет JSON с уровнем %s в нужный поток консоли',
      (method, consoleMethod) => {
        const spy = jest.spyOn(console, consoleMethod).mockImplementation();

        logger[method]('Сообщение', 'Context');

        expect(spy).toHaveBeenCalledTimes(1);
        expect(JSON.parse(spy.mock.calls[0][0])).toEqual({
          level: method,
          message: 'Сообщение',
          optionalParams: ['Context'],
        });
      },
    );

    it('каждый вызов выводит ровно одну строку', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      logger.log('Первое');
      logger.log('Второе');

      expect(spy).toHaveBeenCalledTimes(2);
      spy.mock.calls.forEach(([line]) => expect(line).not.toContain('\n'));
    });
  });
});

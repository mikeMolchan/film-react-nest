import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsServiceMock = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsServiceMock }],
    }).compile();

    controller = module.get(FilmsController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('возвращает список фильмов, полученный от сервиса', async () => {
      const films = { total: 1, items: [{ id: 'film-1', title: 'Фильм' }] };
      filmsServiceMock.findAll.mockResolvedValue(films);

      await expect(controller.findAll()).resolves.toEqual(films);
      expect(filmsServiceMock.findAll).toHaveBeenCalledTimes(1);
    });

    it('возвращает пустой список, если фильмов нет', async () => {
      filmsServiceMock.findAll.mockResolvedValue({ total: 0, items: [] });

      await expect(controller.findAll()).resolves.toEqual({
        total: 0,
        items: [],
      });
    });

    it('пробрасывает ошибку сервиса без изменений', async () => {
      const error = new Error('База недоступна');
      filmsServiceMock.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toBe(error);
    });
  });

  describe('findSchedule', () => {
    it('передаёт id фильма в сервис и возвращает расписание', async () => {
      const schedule = { total: 1, items: [{ id: 'session-1', taken: [] }] };
      filmsServiceMock.findSchedule.mockResolvedValue(schedule);

      await expect(controller.findSchedule('film-1')).resolves.toEqual(
        schedule,
      );
      expect(filmsServiceMock.findSchedule).toHaveBeenCalledWith('film-1');
    });

    it('возвращает пустое расписание для фильма без сеансов', async () => {
      filmsServiceMock.findSchedule.mockResolvedValue({ total: 0, items: [] });

      await expect(controller.findSchedule('film-2')).resolves.toEqual({
        total: 0,
        items: [],
      });
    });

    it('пробрасывает ошибку сервиса без изменений', async () => {
      const error = new Error('База недоступна');
      filmsServiceMock.findSchedule.mockRejectedValue(error);

      await expect(controller.findSchedule('film-1')).rejects.toBe(error);
    });
  });
});
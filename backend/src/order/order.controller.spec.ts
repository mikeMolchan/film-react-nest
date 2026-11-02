import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const orderServiceMock = {
    create: jest.fn(),
  };

  const orderDto: CreateOrderDto = {
    email: 'test@test.ru',
    phone: '+7 (000) 000-00-00',
    tickets: [
      {
        film: 'film-1',
        session: 'session-1',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 1,
        seat: 1,
        price: 350,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderServiceMock }],
    }).compile();

    controller = module.get(OrderController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('передает тело заказа в сервис и возвращает его ответ', async () => {
      const result = {
        total: 1,
        items: [{ ...orderDto.tickets[0], id: 'ticket-1' }],
      };
      orderServiceMock.create.mockResolvedValue(result);

      await expect(controller.create(orderDto)).resolves.toEqual(result);
      expect(orderServiceMock.create).toHaveBeenCalledWith(orderDto);
      expect(orderServiceMock.create).toHaveBeenCalledTimes(1);
    });

    it('пробрасывает ошибку конфликта, если место уже занято', async () => {
      const error = new ConflictException('Место 1:1 уже занято');
      orderServiceMock.create.mockRejectedValue(error);

      await expect(controller.create(orderDto)).rejects.toBe(error);
    });

    it('пробрасывает ошибку, если сеанс не найден', async () => {
      const error = new NotFoundException('Сеанс не найден');
      orderServiceMock.create.mockRejectedValue(error);

      await expect(controller.create(orderDto)).rejects.toBe(error);
    });

    it('отвечает со статусом 200', () => {
      const status = Reflect.getMetadata('__httpCode__', controller.create);

      expect(status).toBe(200);
    });
  });
});

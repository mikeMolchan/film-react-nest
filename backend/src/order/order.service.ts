import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FILMS_REPOSITORY,
  IFilmsRepository,
} from '../repository/films-repository.interface';
import { CreateOrderDto, TicketDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { tickets } = createOrderDto;

    const groups = new Map<string, TicketDto[]>();
    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      const group = groups.get(key) ?? [];
      group.push(ticket);
      groups.set(key, group);
    }

    const updates: { film: string; session: string; taken: string[] }[] = [];

    for (const [, group] of groups) {
      const { film, session } = group[0];
      const schedule = await this.filmsRepository.findScheduleItem(
        film,
        session,
      );

      if (!schedule) {
        throw new NotFoundException(
          `Сеанс ${session} фильма ${film} не найден`,
        );
      }

      const takenSeats = new Set(schedule.taken);

      for (const ticket of group) {
        if (ticket.row > schedule.rows || ticket.seat > schedule.seats) {
          throw new BadRequestException(
            `Место ${ticket.row}:${ticket.seat} находится за пределами зала (максимум ${schedule.rows} рядов, ${schedule.seats} мест)`,
          );
        }

        const seatKey = `${ticket.row}:${ticket.seat}`;
        if (takenSeats.has(seatKey)) {
          throw new ConflictException(
            `Место ${seatKey} уже занято на этом сеансе`,
          );
        }
        takenSeats.add(seatKey);
      }

      updates.push({ film, session, taken: [...takenSeats] });
    }

    await Promise.all(
      updates.map(({ film, session, taken }) =>
        this.filmsRepository.updateTakenSeats(film, session, taken),
      ),
    );

    const items = tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));

    return { total: items.length, items };
  }
}

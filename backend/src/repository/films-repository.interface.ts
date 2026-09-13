import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export interface IFilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findSchedule(filmId: string): Promise<ScheduleDto[]>;
  findScheduleItem(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null>;
  updateTakenSeats(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void>;
}

import { Injectable } from '@nestjs/common';
import { IFilmsRepository } from './films-repository.interface';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

type FilmWithSchedule = FilmDto & { schedule: ScheduleDto[] };

@Injectable()
export class InMemoryFilmsRepository implements IFilmsRepository {
  private readonly films: FilmWithSchedule[] = [
    {
      id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Документальный'],
      title: 'Архитекторы общества',
      about: 'Документальный фильм об искусственном интеллекте.',
      description: 'Полное описание фильма.',
      image: '/bg1s.jpg',
      cover: '/bg1c.jpg',
      schedule: [
        {
          id: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          daytime: '2024-06-28T10:00:53+03:00',
          hall: '0',
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
      ],
    },
  ];

  async findAll(): Promise<FilmDto[]> {
    return this.films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[]> {
    const film = this.films.find((item) => item.id === filmId);
    return film ? film.schedule : [];
  }

  async findScheduleItem(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null> {
    const film = this.films.find((item) => item.id === filmId);
    if (!film) return null;
    return film.schedule.find((item) => item.id === sessionId) ?? null;
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    const film = this.films.find((item) => item.id === filmId);
    const session = film?.schedule.find((item) => item.id === sessionId);
    if (session) session.taken = taken;
  }
}

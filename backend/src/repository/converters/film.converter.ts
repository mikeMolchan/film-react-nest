import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import { FilmDto, ScheduleDto } from '../../films/dto/films.dto';

export function filmEntityToDto(film: Film): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags,
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
  };
}

export function scheduleEntityToDto(schedule: Schedule): ScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: schedule.taken,
  };
}

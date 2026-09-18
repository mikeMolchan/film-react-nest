import { Film, ScheduleItem } from '../schemas/film.schema';
import { FilmDto, ScheduleDto } from '../../films/dto/films.dto';

export function filmDocumentToDto(film: Film): FilmDto {
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

export function scheduleDocumentToDto(item: ScheduleItem): ScheduleDto {
  return {
    id: item.id,
    daytime: item.daytime,
    hall: item.hall,
    rows: item.rows,
    seats: item.seats,
    price: item.price,
    taken: item.taken,
  };
}

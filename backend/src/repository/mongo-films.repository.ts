import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFilmsRepository } from './films-repository.interface';
import { Film } from './schemas/film.schema';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import {
  filmDocumentToDto,
  scheduleDocumentToDto,
} from './converters/film.converter';

@Injectable()
export class MongoFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().exec();
    return films.map(filmDocumentToDto);
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[]> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    return film ? film.schedule.map(scheduleDocumentToDto) : [];
  }

  async findScheduleItem(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    const item = film?.schedule.find((schedule) => schedule.id === sessionId);
    return item ? scheduleDocumentToDto(item) : null;
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $set: { 'schedule.$.taken': taken } },
      )
      .exec();
  }
}

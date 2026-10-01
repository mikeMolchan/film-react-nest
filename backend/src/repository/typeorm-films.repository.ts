import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFilmsRepository } from './films-repository.interface';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import {
  filmEntityToDto,
  scheduleEntityToDto,
} from './converters/film.converter';

@Injectable()
export class TypeOrmFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();
    return films.map(filmEntityToDto);
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: { film: { id: filmId } },
    });
    return schedules.map(scheduleEntityToDto);
  }

  async findScheduleItem(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
    });
    return schedule ? scheduleEntityToDto(schedule) : null;
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    await this.scheduleRepository.update(
      { id: sessionId, film: { id: filmId } },
      { taken },
    );
  }
}

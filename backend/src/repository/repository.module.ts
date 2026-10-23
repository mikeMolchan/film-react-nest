import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { TypeOrmFilmsRepository } from './typeorm-films.repository';
import { FILMS_REPOSITORY } from './films-repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useClass: TypeOrmFilmsRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}

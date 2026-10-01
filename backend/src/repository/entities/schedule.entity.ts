import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column('double precision')
  price: number;

  @Column()
  seats: number;

  @Column({
    type: 'text',
    transformer: {
      to: (value: string[]) => (value ?? []).join(','),
      from: (value: string) => (value ? value.split(',') : []),
    },
  })
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedules)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('double precision')
  rating: number;

  @Column()
  director: string;

  @Column({
    type: 'text',
    transformer: {
      to: (value: string[]) => (value ?? []).join(','),
      from: (value: string) => (value ? value.split(',') : []),
    },
  })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedules: Schedule[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsUUID, IsString, IsDate } from 'class-validator';
import { Rooms } from 'src/modules/rooms/entities/room.entity';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';

@Entity()
export class Sessions {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  session_id: string;

  @ManyToOne(() => Rooms, (room) => room.sessions)
  @JoinColumn({ name: 'room_id' })
  @IsUUID()
  room_id: Rooms['room_id'];

  @Column()
  @IsDate()
  start_time: Date;

  @Column()
  @IsDate()
  end_time: Date;

  @Column('text')
  @IsString()
  description: string;

  @OneToMany(() => Reservations, (reservation) => reservation.session_id)
  reservations: Reservations['reservation_id'][];
}

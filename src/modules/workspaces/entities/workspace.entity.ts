import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsUUID, IsInt, IsString, Length } from 'class-validator';
import { Rooms } from 'src/modules/rooms/entities/room.entity';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';

@Entity()
export class Workspaces {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  workspace_id: string;

  @ManyToOne(() => Rooms, (room) => room.workspaces)
  @JoinColumn({ name: 'room_id' })
  @IsUUID()
  room_id: Rooms['room_id'];

  @Column()
  @IsInt()
  workspace_row: number;

  @Column()
  @IsInt()
  workspace_column: number;

  @Column({ length: 50 })
  @IsString()
  @Length(1, 50)
  type: string;

  @OneToMany(() => Reservations, (reservation) => reservation.workspace_id)
  reservations: Reservations['reservation_id'][];
}

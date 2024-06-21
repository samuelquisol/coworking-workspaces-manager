import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  /* ManyToOne,
  JoinColumn,
  OneToMany, */
} from 'typeorm';
import { IsUUID, IsInt, IsString, Length } from 'class-validator';
/* import { Room } from './room.entity';
import { Reservation } from './reservation.entity';
 */
@Entity()
export class Workspaces {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  workspace_id: string;

  @Column({ nullable: true })
  @IsUUID()
  room_id: string;

  /*   @ManyToOne(() => Room, room => room.workspaces)
  @JoinColumn({ name: 'room_id' })
  room: Room;
 */
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

  /*   @OneToMany(() => Reservation, reservation => reservation.workspace_id)
  reservations: Reservation[];
 */
}

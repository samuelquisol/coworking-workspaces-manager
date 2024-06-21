import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
/*   ManyToOne,
  JoinColumn,
  OneToMany,
 */} from 'typeorm';
import { IsUUID, IsString, IsDate } from 'class-validator';
/* import { Rooms } from 'src/modules/rooms/entities/rooms.entity';
import { Reservation } from '';
 */
@Entity()
export class Sessions {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  session_id: string;

  @Column({ nullable: true })
  @IsUUID()
  room_id: string;

  /*   @ManyToOne(() => Room, (room) => room.sessions)
  @JoinColumn({ name: 'room_id' })
  room: Room;
 */
  @Column({ type: 'timestamp' })
  @IsDate()
  start_time: Date;

  @Column({ type: 'timestamp' })
  @IsDate()
  end_time: Date;

  @Column('text')
  @IsString()
  description: string;

  /*   @OneToMany(() => Reservation, (reservation) => reservation.session_id)
  reservations: Reservation[];
 */
}

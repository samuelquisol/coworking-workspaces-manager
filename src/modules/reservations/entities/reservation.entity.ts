import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  /* ManyToOne,
  JoinColumn, */
} from 'typeorm';
import { IsUUID, IsString, IsDate, Length } from 'class-validator';
/* import { User } from './user.entity';
import { Workspaces } from 'src/modules/workspaces/entities/workspace.entity';
import { Sessions } from 'src/modules/sessions/entities/session.entity';
 */
@Entity()
export class Reservations {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  reservation_id: string;

  @Column({ nullable: true })
  @IsUUID()
  user_id: string;

  /*  @ManyToOne(() => User, user => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user: User; */

  @Column({ nullable: true })
  @IsUUID()
  workspace_id: string;

  /* @ManyToOne(() => Workspaces, workspaces => workspaces.reservations)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspaces; */

  @Column({ nullable: true })
  @IsUUID()
  session_id: string;

  /* @ManyToOne(() => Session, session => session.reservations)
  @JoinColumn({ name: 'session_id' })
  session: Session; */

  @Column({ type: 'timestamp' })
  @IsDate()
  reservation_time: Date;

  @Column({ length: 50 })
  @IsString()
  @Length(1, 50)
  status: string;
}

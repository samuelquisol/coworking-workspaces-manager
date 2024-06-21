import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsUUID, IsString, IsDate, Length } from 'class-validator';
import { Users } from 'src/modules/users/entities/user.entity';
import { Workspaces } from 'src/modules/workspaces/entities/workspace.entity';
import { Sessions } from 'src/modules/sessions/entities/session.entity';

@Entity()
export class Reservations {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  reservation_id: string;

  @ManyToOne(() => Users, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  @IsUUID()
  user_id: Users['user_id'];

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.reservations)
  @JoinColumn({ name: 'workspace_id' })
  @IsUUID()
  workspace_id: Workspaces['workspace_id'];

  @ManyToOne(() => Sessions, (session) => session.reservations)
  @JoinColumn({ name: 'session_id' })
  @IsUUID()
  session_id: Sessions['session_id'];

  @Column({ type: 'timestamp' })
  @IsDate()
  reservation_time: Date;

  @Column({ length: 50 })
  @IsString()
  @Length(1, 50)
  status: string;
}

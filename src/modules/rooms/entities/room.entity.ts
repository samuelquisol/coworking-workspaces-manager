import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsUUID, IsString, Length, IsInt } from 'class-validator';
import { Workspaces } from 'src/modules/workspaces/entities/workspace.entity';
import { Sessions } from 'src/modules/sessions/entities/session.entity';

@Entity()
export class Rooms {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  room_id: string;

  @Column({ length: 100 })
  @IsString()
  @Length(1, 100)
  room_name: string;

  @Column({ length: 100 })
  @IsString()
  @Length(1, 100)
  location: string;

  @Column()
  @IsInt()
  capacity: number;

  @OneToMany(() => Workspaces, (workspaces) => workspaces.room_id)
  workspaces: Workspaces['workspace_id'][];

  @OneToMany(() => Sessions, (sessions) => sessions.room_id)
  sessions: Sessions['session_id'][];
}

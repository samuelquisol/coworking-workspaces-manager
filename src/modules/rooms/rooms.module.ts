import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Rooms } from './entities/room.entity';
import { Workspaces } from 'src/modules/workspaces/entities/workspace.entity';
import { Sessions } from 'src/modules/sessions/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rooms, Workspaces, Sessions])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}

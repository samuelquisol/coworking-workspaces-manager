import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { Workspaces } from './entities/workspace.entity';
import { Rooms } from 'src/modules/rooms/entities/room.entity';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspaces, Rooms, Reservations])],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}

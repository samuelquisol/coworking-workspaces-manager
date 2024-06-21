import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { Sessions } from './entities/session.entity';
import { Rooms } from 'src/modules/rooms/entities/room.entity';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sessions, Rooms, Reservations]),
    WorkspacesModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}

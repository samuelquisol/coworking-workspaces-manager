import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservations } from './entities/reservation.entity';
import { Users } from 'src/modules/users/entities/user.entity';
import { Workspaces } from 'src/modules/workspaces/entities/workspace.entity';
import { Sessions } from 'src/modules/sessions/entities/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservations, Users, Workspaces, Sessions]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservations } from './entities/reservation.entity';
/* import { User } from '';
 */
import { Workspaces } from '../workspaces/entities/workspace.entity';
import { Sessions } from '../sessions/entities/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservations, /* User, */ Workspaces, Sessions]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsUUID, IsEmail, IsString, Length } from 'class-validator';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  user_id: string;

  @Column({ length: 100 })
  @IsString()
  @Length(1, 100)
  user_name: string;

  @Column({ length: 100, unique: true })
  @IsEmail()
  @Length(1, 100)
  email: string;

  @Column({ length: 50 })
  @IsString()
  @Length(1, 50)
  user_type: string;

  @OneToMany(() => Reservations, (reservations) => reservations.user_id)
  reservations: Reservations['reservation_id'][];
}

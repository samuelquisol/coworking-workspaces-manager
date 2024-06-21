import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ description: 'Room ID' })
  @IsUUID()
  @IsNotEmpty()
  room_id: string;

  @ApiProperty({ description: 'Start time of the session' })
  @IsDateString()
  @IsNotEmpty()
  start_time: Date;

  @ApiProperty({ description: 'End time of the session' })
  @IsDateString()
  @IsNotEmpty()
  end_time: Date;

  @ApiProperty({ description: 'Description of the session' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

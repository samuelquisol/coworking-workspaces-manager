import { IsString, Length, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Nombre de la sala',
    example: 'Sala A',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  room_name: string;

  @ApiProperty({
    description: 'Ubicación de la sala',
    example: 'Planta baja',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  location: string;

  @ApiProperty({
    description: 'Capacidad de la sala',
    example: 50,
  })
  @IsInt()
  capacity: number;
}

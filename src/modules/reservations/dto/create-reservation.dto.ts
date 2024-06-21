import { IsUUID, IsDate, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 'e7a04e16-9a92-4ba8-bf29-1e6760f8bc5b',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'ID del espacio de trabajo',
    example: '48801a52-6b08-4b8a-bd02-42e2cfcb1052',
  })
  @IsUUID()
  workspace_id: string;

  @ApiProperty({
    description: 'ID de la sesión',
    example: 'f9e112ed-273f-47ab-9df0-f5a9b5f0ed45',
  })
  @IsUUID()
  session_id: string;

  @ApiProperty({
    description: 'Fecha y hora de la reserva',
    example: '2024-06-25T08:00:00.000Z',
  })
  @IsDate()
  reservation_time: Date;

  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'Confirmed',
    maxLength: 50,
    default: 'Confirmed',
  })
  @IsString()
  @Length(1, 50)
  status: string;
}

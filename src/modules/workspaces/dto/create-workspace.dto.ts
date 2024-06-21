import { IsUUID, IsInt, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({
    description: 'ID de la sala a la que pertenece el espacio de trabajo',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  room_id: string;

  @ApiProperty({
    description: 'Fila del espacio de trabajo dentro de la sala',
    example: 3,
  })
  @IsInt()
  workspace_row: number;

  @ApiProperty({
    description: 'Columna del espacio de trabajo dentro de la sala',
    example: 2,
  })
  @IsInt()
  workspace_column: number;

  @ApiProperty({
    description: 'Tipo de espacio de trabajo',
    example: 'individual',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  type: string;
}

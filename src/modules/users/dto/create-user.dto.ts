import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  user_name: string;

  @ApiProperty({
    description: 'Unique user email address',
    example: 'john.doe@example.com',
    maxLength: 100,
  })
  @IsEmail()
  @Length(1, 100)
  email: string;

  @ApiProperty({
    description: 'Type or category of the user',
    example: 'admin',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  user_type: string;
}

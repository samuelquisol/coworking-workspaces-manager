import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const { email } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists with the same email');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      user_id: uuidv4(),
    });

    return this.usersRepository.save(user);
  }

  async findAll(
    searchTerm: string,
    orderField: string = 'user_name',
    orderType: 'ASC' | 'DESC' = 'ASC',
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Users[]; total: number; page: number; lastPage: number }> {
    let whereClause: any = {};
    if (searchTerm) {
      whereClause = [
        { user_name: ILike(`%${searchTerm}%`) },
        { email: ILike(`%${searchTerm}%`) },
        { user_type: ILike(`%${searchTerm}%`) },
      ];
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where: whereClause,
      order: { [orderField]: orderType },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: users,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(user_id: string): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ user_id });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    return user;
  }

  async update(user_id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    await this.usersRepository.update(user_id, updateUserDto);
    const updatedUser = await this.usersRepository.findOneBy({ user_id });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    return updatedUser;
  }

  async remove(user_id: string): Promise<void> {
    const result = await this.usersRepository.delete(user_id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
  }
}

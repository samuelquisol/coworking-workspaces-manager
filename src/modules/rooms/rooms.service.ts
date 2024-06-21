import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Rooms } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private readonly roomsRepository: Repository<Rooms>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Rooms> {
    const { room_name, location } = createRoomDto;

    const existingRoom = await this.roomsRepository.findOne({
      where: { room_name, location },
    });
    if (existingRoom) {
      throw new ConflictException(
        'Room already exists with the same name and location',
      );
    }

    const room = this.roomsRepository.create({
      ...createRoomDto,
      room_id: uuidv4(),
    });

    return this.roomsRepository.save(room);
  }

  async findAll(
    searchTerm: string,
    orderField: string,
    orderType: 'ASC' | 'DESC',
    page: number,
    limit: number,
  ): Promise<{ data: Rooms[]; total: number; page: number; lastPage: number }> {
    let whereClause: any = {};
    if (searchTerm) {
      whereClause = [
        { room_name: ILike(`%${searchTerm}%`) },
        { location: ILike(`%${searchTerm}%`) },
      ];
    }

    const [rooms, total] = await this.roomsRepository.findAndCount({
      where: whereClause,
      order: { [orderField]: orderType },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: rooms,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(room_id: string): Promise<Rooms> {
    const room = await this.roomsRepository.findOneBy({ room_id });
    if (!room) {
      throw new NotFoundException(`Room with ID ${room_id} not found`);
    }
    return room;
  }

  async update(room_id: string, updateRoomDto: UpdateRoomDto): Promise<Rooms> {
    await this.roomsRepository.update(room_id, updateRoomDto);
    const updatedRoom = await this.roomsRepository.findOneBy({ room_id });
    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID ${room_id} not found`);
    }
    return updatedRoom;
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }
}

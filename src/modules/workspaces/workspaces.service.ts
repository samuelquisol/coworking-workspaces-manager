import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Workspaces } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { v4 as uuidv4 } from 'uuid';
import { Reservations } from '../reservations/entities/reservation.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private readonly workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto): Promise<Workspaces> {
    const { room_id, workspace_row, workspace_column } = createWorkspaceDto;

    const existingWorkspace = await this.workspacesRepository.findOne({
      where: { room_id, workspace_row, workspace_column },
    });
    if (existingWorkspace) {
      throw new ConflictException('Workspace already exists in this location');
    }

    const workspaces = this.workspacesRepository.create({
      ...createWorkspaceDto,
      workspace_id: uuidv4(),
    });

    return this.workspacesRepository.save(workspaces);
  }

  async findAll(
    room_id: string,
    type: string,
    orderField: string,
    orderType: 'ASC' | 'DESC',
    page: number,
    limit: number,
  ): Promise<{
    data: Workspaces[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const whereClause: any = {};
    if (room_id) whereClause.room_id = room_id;
    if (type) whereClause.type = ILike(`%${type}%`);

    const [workspaces, total] = await this.workspacesRepository.findAndCount({
      where: whereClause,
      order: { [orderField]: orderType },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: workspaces,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(workspace_id: string): Promise<Workspaces> {
    const workspace = await this.workspacesRepository.findOneBy({
      workspace_id,
    });
    if (!workspace) {
      throw new NotFoundException(
        `Workspace with ID ${workspace_id} not found`,
      );
    }
    return workspace;
  }

  async update(
    workspace_id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspaces> {
    await this.workspacesRepository.update(workspace_id, updateWorkspaceDto);
    const updatedWorkspace = await this.workspacesRepository.findOneBy({
      workspace_id,
    });
    if (!updatedWorkspace) {
      throw new NotFoundException(
        `Workspace with ID ${workspace_id} not found`,
      );
    }
    return updatedWorkspace;
  }

  async remove(workspace_id: string): Promise<void> {
    const result = await this.workspacesRepository.delete(workspace_id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Workspace with ID ${workspace_id} not found`,
      );
    }
  }

  // Custom Queries

  async findAvailable(
    room_id: string,
    session_id: string,
  ): Promise<Workspaces[]> {
    return this.workspacesRepository.query(
      `
      SELECT *
      FROM Workspaces
      WHERE room_id = $1
      AND workspace_id NOT IN (
          SELECT workspace_id
          FROM Reservations
          WHERE session_id = $2
          AND status = 'confirmed'
      )
    `,
      [room_id, session_id],
    );
  }

  async findOccupied(
    room_id: string,
    session_id: string,
  ): Promise<Workspaces[]> {
    return this.workspacesRepository.query(
      `
      SELECT *
      FROM Workspaces
      WHERE room_id = ${room_id}
      AND workspace_id IN (
          SELECT workspace_id
          FROM Reservations
          WHERE session_id = ${session_id}
          AND status = 'confirmed'
      )
    `,
      [room_id, session_id],
    );
  }

  async findAssignedToUser(user_id: string): Promise<string[]> {
    return this.reservationsRepository.query(
      `
      SELECT workspace_id
      FROM Reservations
      WHERE user_id = ${user_id}
      AND status = 'confirmed'
    `,
      [user_id],
    );
  }

  async findAssignedToSession(session_id: string): Promise<string[]> {
    return this.reservationsRepository.query(
      `
      SELECT workspace_id
      FROM Reservations
      WHERE session_id = ${session_id}
      AND status = 'confirmed'
    `,
      [session_id],
    );
  }
}

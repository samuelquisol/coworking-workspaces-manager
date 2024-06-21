import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspaces } from './entities/workspace.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({
    status: 201,
    description: 'The workspace has been successfully created.',
    type: Workspaces,
  })
  @ApiBody({ type: CreateWorkspaceDto })
  @ApiBadRequestResponse({
    description: 'Invalid data or workspace already exists.',
  })
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspaces> {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all workspaces' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all workspaces successfully.',
    type: [Workspaces],
  })
  @ApiQuery({
    name: 'room_id',
    required: false,
    description: 'Filter workspaces by room ID',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter workspaces by type',
  })
  @ApiQuery({
    name: 'orderField',
    required: false,
    description: 'Field to order by',
    enum: [
      'workspace_id',
      'room_id',
      'workspace_row',
      'workspace_column',
      'type',
    ],
  })
  @ApiQuery({
    name: 'orderType',
    required: false,
    description: 'Order type (ASC or DESC)',
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results per page',
    type: Number,
  })
  async findAll(
    @Query('room_id') room_id: string,
    @Query('type') type: string,
    @Query('orderField') orderField: string = 'workspace_id',
    @Query('orderType') orderType: 'ASC' | 'DESC' = 'ASC',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: Workspaces[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    return this.workspacesService.findAll(
      room_id,
      type,
      orderField,
      orderType,
      page,
      limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a workspace by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the workspace to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved the workspace successfully.',
    type: Workspaces,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or workspace not found.',
  })
  async findOne(@Param('id') id: string): Promise<Workspaces> {
    return this.workspacesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workspace by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the workspace to update' })
  @ApiResponse({
    status: 200,
    description: 'Updated the workspace successfully.',
    type: Workspaces,
  })
  @ApiBody({ type: UpdateWorkspaceDto })
  @ApiBadRequestResponse({
    description: 'Invalid ID format, data, or workspace not found.',
  })
  @ApiBody({ type: Workspaces })
  async update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspaces> {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workspace by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the workspace to delete' })
  @ApiResponse({
    status: 204,
    description: 'Deleted the workspace successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or workspace not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.workspacesService.remove(id);
  }
}

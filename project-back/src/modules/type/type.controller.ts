import { Controller, Get } from '@nestjs/common';
import { TypeService } from './type.service';
import { Type } from './entities/type.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Type')
@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: Type,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async findAllWithFields(): Promise<Type[]> {
    const types: Type[] = await this.typeService.findAllWithFields();
    return types;
  }
}

import { Controller, Get } from '@nestjs/common';
import { FieldDto, TypeWithFieldsDto } from './dtos/type-with-fields.dto';
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
    type: TypeWithFieldsDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async findAllWithFields(): Promise<TypeWithFieldsDto[]> {
    const typesWithFields: Type[] = await this.typeService.findAllWithFields();
    return typesWithFields.map((typeWithField) => {
      const typeWithFieldsDto = new TypeWithFieldsDto();
      typeWithFieldsDto.id = typeWithField.id;
      typeWithFieldsDto.name = typeWithField.name;
      const fieldDto = new FieldDto();
      fieldDto.id = typeWithField.field.id;
      fieldDto.base = JSON.parse(typeWithField.field.base);
      typeWithFieldsDto.field = fieldDto;
      return typeWithFieldsDto;
    });
  }
}

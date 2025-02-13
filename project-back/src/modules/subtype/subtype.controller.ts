import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubTypeService } from './subtype.service';
import { FieldDto, SubTypeWithFieldsDto } from './dtos/subtype-with-fields.dto';
import { SubType } from './entities/subtype.entity';

@ApiTags('SubType')
@Controller('sub-type')
export class SubTypeController {
  constructor(private readonly subTypeService: SubTypeService) {}

  @Get('/:typeId/type')
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: SubTypeWithFieldsDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async findAllWithFields(
    @Param('typeId') typeId: number,
  ): Promise<SubTypeWithFieldsDto[]> {
    const typesWithFields: SubType[] =
      await this.subTypeService.findAllWithFieldsByType(typeId);

    return typesWithFields.map((typeWithField) => {
      const typeWithFieldsDto = new SubTypeWithFieldsDto();
      typeWithFieldsDto.id = typeWithField.id;
      typeWithFieldsDto.name = typeWithField.name;
      typeWithFieldsDto.code = typeWithField.code;
      const fieldDto = new FieldDto();
      fieldDto.id = typeWithField.field.id;
      fieldDto.base = JSON.parse(typeWithField.field.base);
      typeWithFieldsDto.field = fieldDto;
      return typeWithFieldsDto;
    });
  }
}

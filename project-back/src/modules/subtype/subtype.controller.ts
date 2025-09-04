import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubTypeService } from './subtype.service';
import { FieldDto, SubTypeWithFieldsDto } from './dtos/subtype-with-fields.dto';
import { SubType } from './entities/subtype.entity';
import { NotFoundException } from 'src/common/exceptions/custom.exception';

@ApiTags('SubType')
@Controller('sub-type')
export class SubTypeController {
  constructor(private readonly subTypeService: SubTypeService) {}

  @Get('/all')
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
  async findAll(): Promise<SubTypeWithFieldsDto[]> {
    const typesWithFields: SubType[] =
      await this.subTypeService.findAllWithFields();
    return typesWithFields.map((typeWithField) => {
      const typeWithFieldsDto = new SubTypeWithFieldsDto();
      typeWithFieldsDto.id = typeWithField.id;
      typeWithFieldsDto.name = typeWithField.name;
      typeWithFieldsDto.code = typeWithField.code;
      return typeWithFieldsDto;
    });
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully retrieved.',
    type: SubType,
  })
  @ApiResponse({
    status: 404,
    description: 'The record was not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async findById(@Param('id') id: number): Promise<SubTypeWithFieldsDto> {
    const subType = await this.subTypeService.findById(id);
    if (!subType) {
      throw new NotFoundException(`SubType with ID ${id} not found`);
    }

    const typeWithFieldsDto = new SubTypeWithFieldsDto();
    typeWithFieldsDto.id = subType.id;
    typeWithFieldsDto.name = subType.name;
    typeWithFieldsDto.code = subType.code;
    const fieldDto = new FieldDto();
    fieldDto.id = subType.field.id;
    fieldDto.base = JSON.parse(subType.field.base);
    typeWithFieldsDto.field = fieldDto;

    return typeWithFieldsDto;
  }

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

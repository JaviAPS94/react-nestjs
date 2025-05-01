import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DesignTypeService } from './services/design-type.service';
import { DesignSubTypeService } from './services/design-subtype.service';
import { DesignTypeOutputDto } from './dtos/design-type-output.dto';
import { DesignSubTypeOutputDto } from './dtos/design-subtype-output.dto';

@ApiTags('Design')
@Controller('design')
export class DesignController {
  constructor(
    private readonly designTypeService: DesignTypeService,
    private readonly designSubTypeService: DesignSubTypeService,
  ) {}

  @Get('/types')
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: DesignTypeOutputDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getAllDesignTypes(): Promise<DesignTypeOutputDto[]> {
    try {
      const designTypes = await this.designTypeService.findAll();
      return designTypes.map((designType) => {
        const designTypeDto = new DesignTypeOutputDto();
        designTypeDto.id = designType.id;
        designTypeDto.name = designType.name;
        return designTypeDto;
      });
    } catch (error) {
      throw new HttpException(error.message, error?.getStatus() ?? 500);
    }
  }

  @Get('/types/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully retrieved.',
    type: DesignTypeOutputDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Design type not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getDesignTypeById(
    @Param('id') id: number,
  ): Promise<DesignTypeOutputDto> {
    try {
      const designType = await this.designTypeService.findById(id);
      const designTypeDto = new DesignTypeOutputDto();
      designTypeDto.id = designType.id;
      designTypeDto.name = designType.name;
      return designTypeDto;
    } catch (error) {
      throw new HttpException(error.message, error?.getStatus() ?? 500);
    }
  }

  @Get('/subtypes')
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: DesignSubTypeOutputDto,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getAllDesignSubTypes(): Promise<DesignSubTypeOutputDto[]> {
    try {
      const designSubTypes = await this.designSubTypeService.findAll();
      return designSubTypes.map((designSubType) => {
        const designSubTypeDto = new DesignSubTypeOutputDto();
        designSubTypeDto.id = designSubType.id;
        designSubTypeDto.name = designSubType.name;
        designSubTypeDto.designTypeId = designSubType.designType?.id;
        designSubTypeDto.designTypeName = designSubType.designType?.name;
        return designSubTypeDto;
      });
    } catch (error) {
      throw new HttpException(error.message, error?.getStatus() ?? 500);
    }
  }

  @Get('/subtypes/by-type/:typeId')
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: DesignSubTypeOutputDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Design type not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getDesignSubTypesByTypeId(
    @Param('typeId') typeId: number,
  ): Promise<DesignSubTypeOutputDto[]> {
    try {
      const designSubTypes =
        await this.designSubTypeService.findByTypeId(typeId);
      return designSubTypes.map((designSubType) => {
        const designSubTypeDto = new DesignSubTypeOutputDto();
        designSubTypeDto.id = designSubType.id;
        designSubTypeDto.name = designSubType.name;
        designSubTypeDto.designTypeId = designSubType.designType?.id;
        designSubTypeDto.designTypeName = designSubType.designType?.name;
        return designSubTypeDto;
      });
    } catch (error) {
      throw new HttpException(error.message, error?.getStatus() ?? 500);
    }
  }

  @Get('/subtypes/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully retrieved.',
    type: DesignSubTypeOutputDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Design subtype not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async getDesignSubTypeById(
    @Param('id') id: number,
  ): Promise<DesignSubTypeOutputDto> {
    try {
      const designSubType = await this.designSubTypeService.findById(id);
      const designSubTypeDto = new DesignSubTypeOutputDto();
      designSubTypeDto.id = designSubType.id;
      designSubTypeDto.name = designSubType.name;
      designSubTypeDto.designTypeId = designSubType.designType?.id;
      designSubTypeDto.designTypeName = designSubType.designType?.name;
      return designSubTypeDto;
    } catch (error) {
      throw new HttpException(error.message, error?.getStatus() ?? 500);
    }
  }
}

import { ElementResponseDto } from '../dtos/element.dto';
import { Element } from '../entities/element.entity';

export class ElementPaginatedMapper {
  static toDto(entity: Element): ElementResponseDto {
    return {
      id: entity.id,
      values: JSON.parse(entity.values),
      sapReference: entity.sapReference,
      norm: {
        id: entity.norm.id,
        name: entity.norm.name,
        version: entity.norm.version,
        country: {
          id: entity.norm.country.id,
          name: entity.norm.country.name,
          isoCode: entity.norm.country.isoCode,
        },
      },
      subType: {
        id: entity.subType.id,
        name: entity.subType.name,
        code: entity.subType.code,
      },
    };
  }
}

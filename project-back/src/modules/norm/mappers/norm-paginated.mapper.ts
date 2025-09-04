import { Element } from 'src/modules/element/entities/element.entity';
import { ElementOutputDto, NormDataDto } from '../dtos/norm-paginated.dto';
import { Norm } from '../entities/norm.entity';
import { Country } from 'src/modules/country/entities/country.entity';
import { CountryOutputDto } from 'src/modules/country/dtos/country-output.dto';
import { NormSpecification } from '../entities/norm-specification.entity';
import { NormSpecificationOutputDto } from '../dtos/norm-specification-output.dto';
import { deepParseJson } from 'src/common/functions';

export class NormPaginatedMapper {
  static toDto(entity: Norm): NormDataDto {
    return {
      id: entity.id,
      name: entity.name,
      version: entity.version,
      normFile: entity.normFile,
      country: this.toCountryOutputDto(entity.country),
      elements: entity.elements.map((element) =>
        this.toElementOutputDto(element),
      ),
      normSpecification: entity.normSpecification
        ? this.toNormSpecificationOutputDto(entity.normSpecification)
        : null,
    };
  }

  static toCountryOutputDto = (entity: Country): CountryOutputDto => ({
    id: entity.id,
    name: entity.name,
    isoCode: entity.isoCode,
  });

  static toNormSpecificationOutputDto = (
    entity: NormSpecification,
  ): NormSpecificationOutputDto => ({
    id: entity.id,
    name: entity.name,
    code: entity.code,
  });

  static toElementOutputDto = (element: Element): ElementOutputDto => ({
    id: element.id,
    values: deepParseJson(element.values),
    subType: {
      id: element.subType.id,
      name: element.subType.name,
      code: element.subType.code,
      type: {
        id: element.subType?.type?.id,
        name: element.subType?.type?.name,
      },
    },
    sapReference: element.sapReference,
  });
}

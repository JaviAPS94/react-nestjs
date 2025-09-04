import { DesignType } from 'src/modules/design/entities/design-type.entity';
import { DesignSubType } from 'src/modules/design/entities/design-subtype.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class DesignSubType1745805900002 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(DesignSubType);
    const typeRepository = dataSource.getRepository(DesignType);

    await repository.delete({});

    // Get design types
    const conventionalType = await typeRepository.findOne({
      where: { name: 'Convencionales' },
    });
    const pedestalsType = await typeRepository.findOne({
      where: { name: 'Pedestales' },
    });
    const submersiblesType = await typeRepository.findOne({
      where: { name: 'Sumergibles' },
    });
    const driedType = await typeRepository.findOne({
      where: { name: 'Secos' },
    });

    // Create subtypes linked to their parent types
    const subtypes = [];

    // Distribution subtypes
    if (conventionalType) {
      subtypes.push(
        {
          name: '1F',
          designType: conventionalType,
        },
        {
          name: '3F',
          designType: conventionalType,
        },
        {
          name: 'Network',
          designType: conventionalType,
        },
      );
    }

    // Transmission subtypes
    if (pedestalsType) {
      subtypes.push(
        {
          name: '1F',
          designType: pedestalsType,
        },
        {
          name: '3F',
          designType: pedestalsType,
        },
      );
    }

    // Generation subtypes
    if (submersiblesType) {
      subtypes.push(
        {
          name: '1F',
          designType: submersiblesType,
        },
        {
          name: '3F',
          designType: submersiblesType,
        },
      );
    }

    // Industrial subtypes
    if (driedType) {
      subtypes.push(
        {
          name: '1F',
          designType: driedType,
        },
        {
          name: '3F',
          designType: driedType,
        },
      );
    }

    // Insert all subtypes
    await repository.insert(subtypes);
  }
}

import { DesignType } from 'src/modules/design/entities/design-type.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class DesignType1745805900001 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(DesignType);
    await repository.delete({});
    await repository.insert([
      {
        name: 'Convencionales',
      },
      {
        name: 'Pedestales',
      },
      {
        name: 'Sumergibles',
      },
      {
        name: 'Secos',
      },
    ]);
  }
}

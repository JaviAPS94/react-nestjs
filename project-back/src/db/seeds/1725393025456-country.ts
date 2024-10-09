import { Country } from '../../modules/country/entities/country.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class Country1725393025456 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Country);
    await repository.delete({});
    await repository.insert([
      {
        name: 'Colombia',
      },
      {
        name: 'Argentina',
      },
      {
        name: 'Ecuador',
      },
      {
        name: 'Brasil',
      },
      {
        name: 'Uruguay',
      },
      {
        name: 'Panamá',
      },
    ]);
  }
}

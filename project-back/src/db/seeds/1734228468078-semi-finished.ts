import { SemiFinished } from 'src/modules/semi-finished/entities/semiFinished.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class SemiFinished1734228468078 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(SemiFinished);
    await repository.delete({});
    await repository.insert([
      {
        name: 'Bobina',
        code: 'BOBINA',
      },
      {
        name: 'Núcleo',
        code: 'NUCLEO',
      },
      {
        name: 'TanqueDeMetalmecánica',
        code: 'TANQUEMETALMECANICA',
      },
      {
        name: 'TanquePintado',
        code: 'TANQUEPINTADO',
      },
      {
        name: 'EnsambleFinal',
        code: 'ENSAMBLEFINAL',
      },
    ]);
  }
}

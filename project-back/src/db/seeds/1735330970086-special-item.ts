import { SpecialItem } from 'src/modules/element/entities/special-item.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class SpecialItem1735330970086 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(SpecialItem);
    await repository.delete({});
    await repository.insert([
      {
        letter: 'A',
        description: 'Accesorios',
      },
      {
        letter: 'B',
        description: 'Bil Aumentado',
      },
      {
        letter: 'C',
        description: 'Conductor en Cobre',
      },
      {
        letter: 'E',
        description: 'Cambios Eléctricos',
      },
      {
        letter: 'G',
        description: 'Grupo Conexión',
      },
      {
        letter: 'H',
        description: 'Herrajes',
      },
      {
        letter: 'L',
        description: 'Lamina Tanque',
      },
      {
        letter: 'M',
        description: 'Marcación',
      },
      {
        letter: 'N',
        description: 'Núcleo Especial',
      },
      {
        letter: 'O',
        description: 'Tipo Aceite',
      },
      {
        letter: 'P',
        description: 'Pintura',
      },
      {
        letter: 'R',
        description: 'Ruedas',
      },
      {
        letter: 'X',
        description: 'Cambios Varios',
      },
    ]);
  }
}

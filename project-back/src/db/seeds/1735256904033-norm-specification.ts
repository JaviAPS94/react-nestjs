import { NormSpecification } from 'src/modules/norm/entities/norm-specification.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class NormSpecification1735256904033 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(NormSpecification);
    await repository.delete({});
    await repository.insert([
      {
        name: 'NTC Eficiencia A',
        code: 'NTCA',
      },
      {
        name: 'NTC Eficiencia B',
        code: 'NTCB',
      },
      {
        name: 'NTC Eficiencia C',
        code: 'NTCC',
      },
      {
        name: 'NTC Eficiencia D',
        code: 'NTCD',
      },
      {
        name: 'NTC Eficiencia D EPM',
        code: 'NTCDEPM',
      },
      {
        name: 'NTC Eficiencia D Emcali',
        code: 'NTCDEmcali',
      },
      {
        name: 'EPM Licitacion 1',
        code: 'L1EPM',
      },
      {
        name: 'Codensa Licitación 1',
        code: 'L1COD',
      },
      {
        name: 'EBSA Licitación 1',
        code: 'L1EBSA',
      },
      {
        name: 'Naturgy',
        code: 'NATURGY',
      },
      {
        name: 'Ensa',
        code: 'ENSA',
      },
      {
        name: 'Ansi',
        code: 'ANSI',
      },
      {
        name: 'TP1',
        code: 'NEMATP1',
      },
      {
        name: 'Licitacion 1 EEGSA',
        code: 'L1EEGSA',
      },
      {
        name: 'IEC',
        code: 'IEC',
      },
      {
        name: 'De la Paz',
        code: 'DELAPAZ',
      },
    ]);
  }
}

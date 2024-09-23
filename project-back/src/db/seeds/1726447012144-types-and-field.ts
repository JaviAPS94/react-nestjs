import { Field } from 'src/modules/field/entities/field.entity';
import { Type } from 'src/modules/type/entities/type.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class TypesAndField1726447012144 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const fieldRepository = dataSource.getRepository(Field);
    const typeRepository = dataSource.getRepository(Type);

    const fieldData = {
      transformationRatio: {
        label: 'Relación de transformación',
        type: 'string',
        value: '66.67:1',
      },
      ratedPower: {
        label: 'Potencia nominal',
        type: 'string',
        value: '1000VA',
      },
      primaryVoltage: {
        label: 'Voltaje primario',
        type: 'string',
        value: '220V',
      },
      secondaryVoltage: {
        label: 'Voltaje secundario',
        type: 'string',
        value: '15V',
      },
      ratedCurrent: {
        label: 'Corriente nominal',
        type: 'string',
      },
      frequency: {
        label: 'Frecuencia',
        type: 'string',
        value: '60Hz',
      },
      efficiency: {
        label: 'Eficiencia',
        type: 'string',
      },
    };

    await typeRepository.delete({});
    await fieldRepository.delete({});

    const field1 = fieldRepository.create({
      base: JSON.stringify(fieldData),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fieldRepository.save(field1);

    const type1 = typeRepository.create({
      name: 'Transformador',
      field: field1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await typeRepository.save([type1]);
  }
}

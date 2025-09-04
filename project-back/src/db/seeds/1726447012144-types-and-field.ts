import { Field } from 'src/modules/field/entities/field.entity';
import { SubType } from 'src/modules/subtype/entities/subtype.entity';
import { Type } from 'src/modules/type/entities/type.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class TypesAndField1726447012144 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const fieldRepository = dataSource.getRepository(Field);
    const typeRepository = dataSource.getRepository(Type);
    const subTypeRepository = dataSource.getRepository(SubType);

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
    await subTypeRepository.delete({});

    const field1 = fieldRepository.create({
      base: JSON.stringify(fieldData),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fieldRepository.save(field1);

    const type1 = typeRepository.create({
      name: 'Transformador',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await typeRepository.save([type1]);

    await subTypeRepository.insert([
      { name: 'Convencional', type: type1, code: 'CV', field: field1 },
      {
        name: 'Convencional con TC',
        type: type1,
        code: 'CVTC',
        field: field1,
      },
      {
        name: 'Convencional Tridevanado',
        type: type1,
        code: 'CVTR',
        field: field1,
      },
      {
        name: 'Convencional Frente Muerto',
        type: type1,
        code: 'CVFM',
        field: field1,
      },
      {
        name: 'Convencional Conmutable',
        type: type1,
        code: 'CVCM',
        field: field1,
      },
      {
        name: 'Convencional Antifraude',
        type: type1,
        code: 'CVAF',
        field: field1,
      },
      {
        name: 'Convencional Autotransformador',
        type: type1,
        code: 'CVAT',
        field: field1,
      },
      {
        name: 'Convencional Elevador',
        type: type1,
        code: 'CVEL',
        field: field1,
      },
      { name: 'Autoprotegido', type: type1, code: 'AU', field: field1 },
      {
        name: 'Autoprotegido con TC',
        type: type1,
        code: 'AUTC',
        field: field1,
      },
      {
        name: 'Autoprotegido Frente Muerto',
        type: type1,
        code: 'AUFM',
        field: field1,
      },
      {
        name: 'Autoprotegido Conmutable',
        type: type1,
        code: 'AUCM',
        field: field1,
      },
      {
        name: 'Autoprotegido Antifraude',
        type: type1,
        code: 'AUAF',
        field: field1,
      },
      {
        name: 'Sumergible Radial',
        type: type1,
        code: 'SUR',
        field: field1,
      },
      { name: 'Sumergible Malla', type: type1, code: 'SUM', field: field1 },
      {
        name: 'Sumergible Radial Modificado',
        type: type1,
        code: 'SURM',
        field: field1,
      },
      { name: 'Pedestal Radial', type: type1, code: 'PR', field: field1 },
      {
        name: 'Pedestal Radial Modificado',
        type: type1,
        code: 'PRM',
        field: field1,
      },
      { name: 'Pedestal Malla', type: type1, code: 'PM', field: field1 },
      {
        name: 'Pedestal Radial Autoprotegido',
        type: type1,
        code: 'PRAU',
        field: field1,
      },
      {
        name: 'Pedestal Radial Frente Muerto',
        type: type1,
        code: 'PRFV',
        field: field1,
      },
      {
        name: 'Pedestal Radial Conmutable',
        type: type1,
        code: 'PRCM',
        field: field1,
      },
      {
        name: 'Pedestal Radial con TC',
        type: type1,
        code: 'PRTC',
        field: field1,
      },
      {
        name: 'Pedestal Radial Tridevanado',
        type: type1,
        code: 'PRTR',
        field: field1,
      },
      { name: 'Seco Clase H', type: type1, code: 'SEH', field: field1 },
      { name: 'Seco Clase F', type: type1, code: 'SEF', field: field1 },
      {
        name: 'Seco Clase H Autotransformador',
        type: type1,
        code: 'SEHAT',
        field: field1,
      },
      {
        name: 'Seco Clase H Tridevanado',
        type: type1,
        code: 'SEHTR',
        field: field1,
      },
    ]);
  }
}

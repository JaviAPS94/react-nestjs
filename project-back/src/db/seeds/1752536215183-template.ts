import { DesignSubType } from 'src/modules/design/entities/design-subtype.entity';
import { Template } from 'src/modules/design/entities/template.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class Template1752536215183 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const designSubTypeRepository = dataSource.getRepository(DesignSubType);
    const templateRepository = dataSource.getRepository(Template);

    //Get design subtypes
    const distributionSubType = await designSubTypeRepository.findOne({
      where: { name: '1F' },
    });

    const transmissionSubType = await designSubTypeRepository.findOne({
      where: { name: '3F' },
    });

    const templates = [];
    // Create templates linked to their subtypes
    templates.push(
      {
        name: 'Template 1F',
        code: 'TEMPLATE_1F_0001',
        description: 'Plantilla para sub diseño 1F',
        designSubType: distributionSubType,
        cellsStyles: JSON.stringify({
          columnWidths: { 0: 120, 1: 100, 2: 120 },
          rowHeights: {},
        }),
        cells: JSON.stringify({
          A1: {
            value: 'Análisis Cuadrático',
            formula: 'Análisis Cuadrático',
            computed: 'Análisis Cuadrático',
          },
          A2: {
            value: 'f(x) = ax² + bx + c',
            formula: 'f(x) = ax² + bx + c',
            computed: 'f(x) = ax² + bx + c',
          },
          A4: {
            value: 'Coeficientes:',
            formula: 'Coeficientes:',
            computed: 'Coeficientes:',
          },
          A5: { value: 'a =', formula: 'a =', computed: 'a =' },
          B5: { value: '1', formula: '1', computed: 1 },
          A6: { value: 'b =', formula: 'b =', computed: 'b =' },
          B6: { value: '2', formula: '2', computed: 2 },
          A7: { value: 'c =', formula: 'c =', computed: 'c =' },
          B7: { value: '1', formula: '1', computed: 1 },
          A9: {
            value: 'Valores de Prueba:',
            formula: 'Valores de Prueba:',
            computed: 'Valores de Prueba:',
          },
          A10: { value: 'x', formula: 'x', computed: 'x' },
          B10: { value: 'f(x)', formula: 'f(x)', computed: 'f(x)' },
          A11: { value: '0', formula: '0', computed: 0 },
          B11: {
            value: '=QUADRATIC(A11)',
            formula: '=QUADRATIC(A11)',
            computed: 1,
          },
          A12: { value: '1', formula: '1', computed: 1 },
          B12: {
            value: '=QUADRATIC(A12)',
            formula: '=QUADRATIC(A12)',
            computed: 4,
          },
          A13: { value: '2', formula: '2', computed: 2 },
          B13: {
            value: '=QUADRATIC(A13)',
            formula: '=QUADRATIC(A13)',
            computed: 9,
          },
          A14: { value: '-1', formula: '-1', computed: -1 },
          B14: {
            value: '=QUADRATIC(A14)',
            formula: '=QUADRATIC(A14)',
            computed: 0,
          },
        }),
      },
      {
        name: 'Plantilla 3F',
        code: 'TEMPLATE_3F_0001',
        description: 'Plantilla para sub diseño 3F (Análisis Cúbico)',
        designSubType: transmissionSubType,
        cellsStyles: JSON.stringify({
          columnWidths: { 0: 120, 1: 100, 2: 120 },
          rowHeights: {},
        }),
        cells: JSON.stringify({
          A1: {
            value: 'Análisis Cúbico',
            formula: 'Análisis Cúbico',
            computed: 'Análisis Cúbico',
          },
          A2: {
            value: 'f(x) = ax³ + bx + c',
            formula: 'f(x) = ax³ + bx + c',
            computed: 'f(x) = ax³ + bx + c',
          },
          A4: {
            value: 'Coeficientes:',
            formula: 'Coeficientes:',
            computed: 'Coeficientes:',
          },
          A5: { value: 'a =', formula: 'a =', computed: 'a =' },
          B5: { value: '1', formula: '1', computed: 1 },
          A6: { value: 'b =', formula: 'b =', computed: 'b =' },
          B6: { value: '2', formula: '2', computed: 2 },
          A7: { value: 'c =', formula: 'c =', computed: 'c =' },
          B7: { value: '1', formula: '1', computed: 1 },
          A9: {
            value: 'Valores de Prueba:',
            formula: 'Valores de Prueba:',
            computed: 'Valores de Prueba:',
          },
          A10: { value: 'x', formula: 'x', computed: 'x' },
          B10: { value: 'f(x)', formula: 'f(x)', computed: 'f(x)' },
          A11: { value: '0', formula: '0', computed: 0 },
          B11: {
            value: '=CUBIC(A11, A5)',
            formula: '=CUBIC(A11, A5)',
            computed: 1,
          },
          A12: { value: '1', formula: '1', computed: 1 },
          B12: {
            value: '=CUBIC(A12, A5)',
            formula: '=CUBIC(A12, A5)',
            computed: 4,
          },
          A13: { value: '2', formula: '2', computed: 2 },
          B13: {
            value: '=CUBIC(A13, A5)',
            formula: '=CUBIC(A13, A5)',
            computed: 9,
          },
          A14: { value: '-1', formula: '-1', computed: -1 },
          B14: {
            value: '=CUBIC(A14, A5)',
            formula: '=CUBIC(A14, A5)',
            computed: 0,
          },
        }),
      },
      {
        name: 'Plantilla 3F Transmisión',
        code: 'TEMPLATE_3F_0002',
        description:
          'Plantilla para sub diseño 3F Transmisión (Análisis Cuadrático)',
        designSubType: transmissionSubType,
        cellsStyles: JSON.stringify({
          columnWidths: { 0: 120, 1: 100, 2: 120 },
          rowHeights: {},
        }),
        cells: JSON.stringify({
          A1: {
            value: 'Análisis Cuadrático',
            formula: 'Análisis Cuadrático',
            computed: 'Análisis Cuadrático',
          },
          A2: {
            value: 'f(x) = ax² + bx + c',
            formula: 'f(x) = ax² + bx + c',
            computed: 'f(x) = ax² + bx + c',
          },
          A4: {
            value: 'Coeficientes:',
            formula: 'Coeficientes:',
            computed: 'Coeficientes:',
          },
          A5: { value: 'a =', formula: 'a =', computed: 'a =' },
          B5: { value: '1', formula: '1', computed: 1 },
          A6: { value: 'b =', formula: 'b =', computed: 'b =' },
          B6: { value: '2', formula: '2', computed: 2 },
          A7: { value: 'c =', formula: 'c =', computed: 'c =' },
          B7: { value: '1', formula: '1', computed: 1 },
          A9: {
            value: 'Valores de Prueba:',
            formula: 'Valores de Prueba:',
            computed: 'Valores de Prueba:',
          },
          A10: { value: 'x', formula: 'x', computed: 'x' },
          B10: { value: 'f(x)', formula: 'f(x)', computed: 'f(x)' },
          A11: { value: '0', formula: '0', computed: 0 },
          B11: {
            value: '=QUADRATIC(A11)',
            formula: '=QUADRATIC(A11)',
            computed: 1,
          },
          A12: { value: '1', formula: '1', computed: 1 },
          B12: {
            value: '=QUADRATIC(A12)',
            formula: '=QUADRATIC(A12)',
            computed: 4,
          },
          A13: { value: '2', formula: '2', computed: 2 },
          B13: {
            value: '=QUADRATIC(A13)',
            formula: '=QUADRATIC(A13)',
            computed: 9,
          },
          A14: { value: '-1', formula: '-1', computed: -1 },
          B14: {
            value: '=QUADRATIC(A14)',
            formula: '=QUADRATIC(A14)',
            computed: 0,
          },
        }),
      },
    );

    await templateRepository.save(templates);
  }
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DesignSubTypeFunction } from './design-subtype-function.entity';
import { SubDesignFunction } from './sub-design-function.entity';

@Entity('design_function')
export class DesignFunction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text' })
  expression: string;

  @Column({ type: 'text' })
  variables: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(
    () => DesignSubTypeFunction,
    (designSubTypeFunction) => designSubTypeFunction.designSubType,
  )
  designSubTypeFunctions: DesignSubTypeFunction[];

  @OneToMany(
    () => SubDesignFunction,
    (subDesignFunction) => subDesignFunction.designFunction,
  )
  subDesignFunctions: SubDesignFunction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

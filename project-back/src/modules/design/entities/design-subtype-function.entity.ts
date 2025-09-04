import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DesignSubType } from './design-subtype.entity';
import { DesignFunction } from './design-function.entity';

@Entity('design_subtype_function')
export class DesignSubTypeFunction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => DesignSubType,
    (designSubType) => designSubType.designSubTypeFunctions,
  )
  @JoinColumn({ name: 'design_subtype_id' })
  designSubType: DesignSubType;

  @ManyToOne(
    () => DesignFunction,
    (designFunction) => designFunction.designSubTypeFunctions,
  )
  @JoinColumn({ name: 'design_function_id' })
  designFunction: DesignFunction;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

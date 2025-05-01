import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DesignFunction } from './design-function.entity';
import { SubDesign } from './sub-design.entity';

@Entity('sub_design_function')
export class SubDesignFunction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => DesignFunction,
    (designFunction) => designFunction.subDesignFunctions,
  )
  @JoinColumn({ name: 'design_function_id' })
  designFunction: DesignFunction;

  @ManyToOne(() => SubDesign, (subDesign) => subDesign.subDesignFunctions)
  @JoinColumn({ name: 'sub_design_id' })
  subDesign: SubDesign;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

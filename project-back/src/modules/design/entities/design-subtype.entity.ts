import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DesignType } from './design-type.entity';
import { DesignSubTypeFunction } from './design-subtype-function.entity';

@Entity('design_subtype')
export class DesignSubType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nvarchar', { length: 'max' })
  name: string;

  @ManyToOne(() => DesignType, (designType) => designType.designSubTypes)
  @JoinColumn({ name: 'design_type_id' })
  designType: DesignType;

  @OneToMany(
    () => DesignSubTypeFunction,
    (designSubTypeFunction) => designSubTypeFunction.designSubType,
  )
  designSubTypeFunctions: DesignSubTypeFunction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

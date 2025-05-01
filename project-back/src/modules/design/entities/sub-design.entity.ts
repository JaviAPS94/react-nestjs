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
import { SubDesignFunction } from './sub-design-function.entity';
import { Design } from './design.entity';

@Entity()
export class SubDesign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nvarchar', { length: 'max' })
  name: string;

  @Column('nvarchar', { length: 'max' })
  code: string;

  @OneToMany(
    () => SubDesignFunction,
    (subDesignFunction) => subDesignFunction.subDesign,
  )
  subDesignFunctions: SubDesignFunction[];

  @ManyToOne(() => Design, (design) => design.subDesigns)
  @JoinColumn({ name: 'design_id' })
  design: Design;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

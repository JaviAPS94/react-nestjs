import { Type } from '../../type/entities/type.entity';
import { Norm } from '../../norm/entities/norm.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Element {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nvarchar', { length: 'max' })
  values: string;

  @ManyToOne(() => Norm, (norm) => norm.elements)
  @JoinColumn({ name: 'norm_id' })
  norm: Norm;

  @ManyToOne(() => Type, (type) => type.elements)
  @JoinColumn({ name: 'type_id' })
  type: Type;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

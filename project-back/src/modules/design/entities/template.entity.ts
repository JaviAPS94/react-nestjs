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

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nvarchar', { length: 'max', nullable: true })
  name: string;

  @Column('nvarchar', { length: 'max' })
  code: string;

  @Column({ type: 'nvarchar', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  cellsStyles?: string;

  @Column({ type: 'text' })
  cells?: string;

  @ManyToOne(() => DesignSubType, (designSubType) => designSubType.templates)
  @JoinColumn({ name: 'design_sub_type_id' })
  designSubType: DesignSubType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

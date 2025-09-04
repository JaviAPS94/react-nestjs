import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Design } from './design.entity';
import { Element } from 'src/modules/element/entities/element.entity';

@Entity('design_element')
export class DesignElement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Design, (design) => design.designElements)
  @JoinColumn({ name: 'design_id' })
  design: Design;

  @ManyToOne(() => Element, (element) => element.designElements)
  @JoinColumn({ name: 'element_id' })
  element: Element;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

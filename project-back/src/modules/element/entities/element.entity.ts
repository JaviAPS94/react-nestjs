import { Norm } from '../../norm/entities/norm.entity';
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
import { SubType } from '../../subtype/entities/subtype.entity';
import { SpecialItem } from './special-item.entity';
import { DesignElement } from 'src/modules/design/entities/design-element.entity';

@Entity()
export class Element {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nvarchar', { length: 'max' })
  values: string;

  @Column({ name: 'sap_refence', nullable: true })
  sapReference: string;

  @ManyToOne(() => Norm, (norm) => norm.elements)
  @JoinColumn({ name: 'norm_id' })
  norm: Norm;

  @ManyToOne(() => SubType, (subType) => subType.elements)
  @JoinColumn({ name: 'subtype_id' })
  subType: SubType;

  @ManyToOne(() => SpecialItem, (specialItem) => specialItem.elements)
  @JoinColumn({ name: 'special_item_id' })
  specialItem: SpecialItem;

  @OneToMany(() => DesignElement, (designElement) => designElement.element)
  designElements: DesignElement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

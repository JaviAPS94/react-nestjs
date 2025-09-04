import { Field } from '../../field/entities/field.entity';
import { Element } from '../../element/entities/element.entity';
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
import { Type } from 'src/modules/type/entities/type.entity';

@Entity()
export class SubType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @OneToMany(() => Element, (element) => element.subType)
  elements: Element[];

  @ManyToOne(() => Field, (field) => field.subTypes)
  @JoinColumn({ name: 'field_id' })
  field: Field;

  @ManyToOne(() => Type, (type) => type.subTypes)
  @JoinColumn({ name: 'type_id' })
  type: Type;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

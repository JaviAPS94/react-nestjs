import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Element } from './element.entity';

@Entity()
export class SpecialItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  letter: string;

  @Column()
  description: string;

  @OneToMany(() => Element, (element) => element.specialItem)
  elements: Element[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

import { Element } from '../../element/entities/element.entity';
import { Country } from '../../country/entities/country.entity';
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

@Entity()
export class Norm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  version: string;

  @ManyToOne(() => Country, (country) => country.norms)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Element, (element) => element.norm)
  elements: Element[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

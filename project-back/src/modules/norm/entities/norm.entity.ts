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
import { NormSpecification } from './norm-specification.entity';

@Entity()
export class Norm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column({ nullable: true })
  normFile: string;

  @ManyToOne(() => Country, (country) => country.norms)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(
    () => NormSpecification,
    (normSpecification) => normSpecification.norms,
  )
  @JoinColumn({ name: 'norm_specification_id' })
  normSpecification: NormSpecification;

  @OneToMany(() => Element, (element) => element.norm)
  elements: Element[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

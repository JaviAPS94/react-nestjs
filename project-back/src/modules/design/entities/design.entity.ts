import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubDesign } from './sub-design.entity';
import { DesignElement } from './design-element.entity';

@Entity()
export class Design {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nvarchar', { length: 'max' })
  name: string;

  @Column('nvarchar', { length: 'max' })
  code: string;

  @OneToMany(() => SubDesign, (subDesign) => subDesign.design)
  subDesigns: SubDesign[];

  @OneToMany(() => DesignElement, (designElement) => designElement.design)
  designElements: DesignElement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

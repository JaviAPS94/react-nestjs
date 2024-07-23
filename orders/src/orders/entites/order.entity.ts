import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('decimal', { precision: 5, scale: 2 })
  total: number;
  @Column()
  date: Date;
  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}

//Una orden le corresponde solo a un usuario

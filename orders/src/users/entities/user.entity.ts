import { Order } from '../../orders/entites/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  lastName: string;
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

//Un usuario puede tener una o varias ordenes

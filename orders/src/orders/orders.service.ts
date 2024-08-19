import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entites/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    //Obtener los pedidos de nuestra base de datos
    return this.ordersRepository.find({
      relations: ['user'],
    });
  }

  async create(orderDto: CreateOrderDto) {
    //Vamos a validar si el usuario existe o no en nuestra BDD
    //Vamos a buscar el usuario con el id que llega en el DTO
    const user = await this.usersRepository.findOne({
      where: { id: orderDto.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const order = new Order();

    order.total = orderDto.total;
    order.date = orderDto.date;
    order.user = user;

    return this.ordersRepository.save(order);
  }
}

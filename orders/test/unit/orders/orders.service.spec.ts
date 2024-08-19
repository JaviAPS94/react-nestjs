import { Repository } from 'typeorm';
import { OrdersService } from '../../../src/orders/orders.service';
import { Order } from '../../../src/orders/entites/order.entity';
import { User } from '../../../src/users/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import exp from 'constants';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: Repository<Order>;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: 'OrderRepository',
          useClass: Repository,
        },
        {
          provide: 'UserRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>('OrderRepository');
    usersRepository = module.get<Repository<User>>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const expectedOrders = [
        {
          id: 1,
          total: 100,
          date: new Date(),
          user: {
            id: 1,
            name: 'Test',
            lastName: 'Test',
            orders: [],
          },
        },
      ];

      jest.spyOn(ordersRepository, 'find').mockResolvedValue(expectedOrders);

      const orders = await service.findAll();
      expect(orders).toEqual(expectedOrders);
      expect(ordersRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
      });
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const orderDto: CreateOrderDto = {
        total: 100,
        date: new Date(),
        userId: 1,
      };

      const user: User = {
        id: 1,
        name: 'Test',
        lastName: 'Test',
        orders: [],
      };

      const order: Order = {
        id: 1,
        ...orderDto,
        user,
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);

      const result = await service.create(orderDto);
      expect(result).toEqual(order);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderDto.userId },
      });
      expect(ordersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          total: orderDto.total,
          date: orderDto.date,
          user: user,
        }),
      );
    });

    it('should throw an error if user does not exist', async () => {
      const orderDto: CreateOrderDto = {
        total: 100,
        date: new Date(),
        userId: 1,
      };
      const user: User = {
        id: 1,
        name: 'Test',
        lastName: 'Test',
        orders: [],
      };
      const order: Order = {
        id: 1,
        ...orderDto,
        user,
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);

      await expect(service.create(orderDto)).rejects.toThrow('User not found');
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderDto.userId },
      });
      expect(ordersRepository.save).not.toHaveBeenCalled();
    });
  });
});

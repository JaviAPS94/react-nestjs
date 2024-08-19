import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../../../src/orders/orders.controller';
import { OrdersService } from '../../../src/orders/orders.service';
import { CreateOrderDto } from '../../../src/orders/dto/create-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      jest.spyOn(ordersService, 'findAll').mockResolvedValue(expectedOrders);

      const orders = await controller.findAll();

      expect(orders).toEqual(expectedOrders);
      expect(ordersService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const orderDto: CreateOrderDto = {
        total: 100,
        date: new Date(),
        userId: 1,
      };

      const expectedOrder = {
        id: 1,
        ...orderDto,
        user: {
          id: 1,
          name: 'Test',
          lastName: 'Test',
          orders: [],
        },
      };

      jest.spyOn(ordersService, 'create').mockResolvedValue(expectedOrder);

      const result = await controller.create(orderDto);
      expect(result).toEqual(expectedOrder);
      expect(ordersService.create).toHaveBeenCalledWith(orderDto);
    });
  });
});

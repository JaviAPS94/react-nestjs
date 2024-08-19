import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../src/users/users.controller';
import { UsersService } from '../../../src/users/users.service';
import { CreateUserDto } from '../../../src/users/dto/create-user.dto';
import { User } from '../../../src/users/entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedResults = [
        { id: 1, name: 'John', lastName: 'Doe', orders: [] },
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(expectedResults);

      const users = await controller.findAll();
      expect(users).toEqual(expectedResults);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto: CreateUserDto = {
        name: 'John',
        lastName: 'Doe',
      };

      const expectedUser: User = {
        id: 1,
        ...userDto,
        orders: [],
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(expectedUser);

      const result = await controller.create(userDto);
      expect(result).toEqual(expectedUser);
      expect(usersService.create).toHaveBeenCalledWith(userDto);
    });
  });
});

import { Repository } from 'typeorm';
import { UsersService } from '../../../src/users/users.service';
import { User } from '../../../src/users/entities/user.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { CreateUserDto } from '../../../src/users/dto/create-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  //before -> es que vamos a ejecutar determinadas acciones antes de que se ejecute cada uno de los tests, ocurre una sola vez
  //beforeEach -> es que vamos a ejecutar determinadas acciones antes de que se ejecute cada uno de los tests, ocurre una vez por cada test
  //after -> es que vamos a ejecutar determinadas acciones después de que se ejecute cada uno de los tests, ocurre una sola vez
  //afterEach -> es que vamos a ejecutar determinadas acciones después de que se ejecute cada uno de los tests, ocurre una vez por cada test

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>('UserRepository');
  });

  //Cada vez que vayamos a definir un escenario de test, debemos utilizar la función it
  it('users service should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'Test',
          lastName: 'Test',
          orders: [],
        },
      ];

      jest.spyOn(usersRepository, 'find').mockResolvedValue(mockUsers);

      const users = await usersService.findAll();

      expect(users).toEqual(mockUsers);
      expect(usersRepository.find).toHaveBeenCalledWith({
        relations: ['orders'],
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto: CreateUserDto = {
        name: 'Test',
        lastName: 'Test',
      };

      const savedUser: User = { id: 1, ...userDto, orders: [] };

      jest.spyOn(usersRepository, 'save').mockResolvedValue(savedUser);

      const result = await usersService.create(userDto);

      expect(result).toEqual(savedUser);
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(userDto),
      );
    });
  });
});

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

//En esta capa de servicios podemos utilizar los repositorios
//Los repositiorios son clases que nos permiten interactuar con la BDD
//Y estos ya estan proporcionados por TYPEORM y Nestjs
@Injectable()
export class UsersService {
  //Inyección de dependencias, repositorio de usuarios
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find({
      relations: ['orders'],
    });
  }

  create(userDto: CreateUserDto) {
    const user = new User();

    user.name = userDto.name;
    user.lastName = userDto.lastName;

    return this.usersRepository.save(user);
  }
}

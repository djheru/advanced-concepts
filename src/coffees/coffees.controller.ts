import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  RequestTimeoutException,
  UseInterceptors,
} from '@nestjs/common';
import { CircuitBreakerInterceptor } from 'src/common/interceptors/circuit-breaker/circuit-breaker.interceptor';
import { COFFEES_DATA_SOURCE, CoffeesDataSource } from './coffees.datasource';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
@UseInterceptors(CircuitBreakerInterceptor)
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(COFFEES_DATA_SOURCE) private readonly datasource: CoffeesDataSource,
  ) {}

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Get()
  findAll() {
    console.log('findAll called');
    throw new RequestTimeoutException('oopsie');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(+id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(+id);
  }
}

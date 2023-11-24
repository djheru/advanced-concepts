import { Coffee } from './entities/coffee.entity';

export const COFFEES_DATA_SOURCE = Symbol('COFFEES_DATA_SOURCE');
export interface CoffeesDataSource {
  [index: number]: Coffee;
}

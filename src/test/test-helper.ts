/* tslint:disable */
import { Controller, Get, INestApplication, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { GenerateORMFilter } from '../decorators/orm-filter.decorator';
import { ORMFilter } from '../types/orm-filter';
import { GenerateArrayFilter } from '../decorators/array-filter.decorator';
import { ArrayFilter } from '../types/array-filter';


class SamplePerson {
  id: number;
  name: string;
  age: number;
  isAlive: boolean;
  dob: Date;
}

/**
 * Controller
 */
@Controller()
/**
 * Controller returning a lot of documents
 */
class FakeAppController {
  /**
   * Fake route that returns the ORMFilters
   */
  @Get('/orm-data')
  public getORMFilters(@GenerateORMFilter() ormFilter: ORMFilter): ORMFilter {
    return ormFilter;
  }

  sampleArrayData: SamplePerson[] = [
    { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: new Date('1999-01-01') },
    { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: new Date('1998-01-01') },
    { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: new Date('1997-01-01') },
    { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: new Date('1996-01-01') },
    { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: new Date('1995-07-21') },
    { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: new Date('1994-01-01') },
    { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: new Date('1993-01-01') },
    { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: new Date('1992-01-01') },
    { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: new Date('1991-01-01') },
    { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: new Date('1990-01-01') },
    { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: new Date('1989-01-01') },
    { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: new Date('1988-01-01') },
    { id: 13, name: 'Aya', age: 140, isAlive: true, dob: new Date('1987-01-01') },
  ]

  /**
   * Fake route that returns the ArrayFilter
   */
  @Get('/array-data')
  public getArrayFilters(@GenerateArrayFilter() arrayFilter: ArrayFilter): SamplePerson[] {
    return this.sampleArrayData.filter(arrayFilter);
  }
}

/**
 * Fake app module
 */
/* tslint:disable */
@Module({
  controllers: [FakeAppController]
})
class AppModule {}
/* tslint:enable */

export async function createTestAppModule(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  return moduleFixture.createNestApplication();
}
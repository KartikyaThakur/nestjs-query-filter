/* tslint:disable */
import { Controller, Get, INestApplication, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { GenerateORMFilter } from '../decorators/orm-filter.decorator';
import { ORMFilter } from '../types/orm-filter';
import { GenerateArrayFilter } from '../decorators/array-filter.decorator';
import { ArrayFilter } from '../types/array-filter';
import { PaginationOption } from '../decorators/pagination-query.decorator';
import { PaginationQuery } from '../types/pagination-query';

import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoServer = new MongoMemoryServer();

class SamplePerson {
  _id: number;
  name: string;
  age: number;
  isAlive: boolean;
  dob: Date;
  meta: {
    game: {
      name: string,
      releasedOn: Date,
      year: number
    }
  };
  tags: string[];
}

/**
 * Controller
 */
@Controller()
/**
 * Controller returning a lot of documents
 */
class FakeAppController {

  sampleArrayData: SamplePerson[] = sampleArrayData.map((person: SamplePerson) => {
    return {
      ...person,
      dob: new Date(person.dob),
      meta: {
        game: {
          ...person.meta.game,
          releasedOn: new Date(person.meta.game.releasedOn)
        }
      }
    }
  });

  /**
   * Fake route that returns the ORMFilters
   */
  @Get('/orm-data')
  public getORMFilters(@GenerateORMFilter() ormFilter: ORMFilter, @PaginationOption() paginationOption: PaginationQuery) {
    console.log(paginationOption);
    return JSON.stringify(ormFilter);
  }

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

export { SamplePerson };

export const sampleArrayData: SamplePerson[] = [
  { _id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: new Date('1999-01-01'), meta: { game: { name: 'Assassins Creed II', releasedOn: new Date('2009-01-01'), year: 2009}}, tags: ['1', '2009']},
  { _id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: new Date('1998-01-01'), meta: { game: { name: 'Assassins Creed', releasedOn: new Date('2007-01-01'), year: 2007}}, tags: ['2', '2007']},
  { _id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: new Date('1997-01-01'), meta: { game: { name: 'Assassins Creed III', releasedOn: new Date('2012-01-01'), year: 2012} }, tags: ['3', '2012']},
  { _id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: new Date('1996-01-01'), meta: { game: { name: 'Assassins Creed IV: Black Flag', releasedOn: new Date('2013-01-01'), year: 2013}}, tags: ['4', '2013']},
  { _id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: new Date('1995-07-21'), meta: { game: { name: 'Assassins Creed III: Liberation', releasedOn: new Date('2012-01-01'), year: 2012}}, tags: ['5', '2012']},
  { _id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: new Date('1994-01-01'), meta: { game: { name: 'Assassins Creed Odyssey', releasedOn: new Date('2018-01-01'), year: 2018}}, tags: ['6', '2018']},
  { _id: 7, name: 'Alexios', age: 80, isAlive: true, dob: new Date('1993-01-01'), meta: { game: { name: 'Assassins Creed Odyssey', releasedOn: new Date('2018-01-01'), year: 2018},}, tags: ['7', '2018']},
  { _id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: new Date('1992-01-01'), meta: { game: { name: 'Assassins Creed III: Liberation', releasedOn: new Date('2012-01-01'), year: 2012}}, tags: ['8', '2012']},
  { _id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: new Date('1991-01-01'), meta: { game: { name: 'Assassins Creed Unity', releasedOn: new Date('2014-01-01'), year: 2014}}, tags: ['9', '2014']},
  { _id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: new Date('1990-01-01'), meta: { game: { name: 'Assassins Creed Syndicate', releasedOn: new Date('2015-01-01'), year: 2015}}, tags: ['10', '2015']},
  { _id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: new Date('1989-01-01'), meta: { game: { name: 'Assassins Creed Syndicate', releasedOn: new Date('2015-01-01'), year: 2015}}, tags: ['11', '2015']},
  { _id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: new Date('1988-01-01'), meta: { game: { name: 'Assassins Creed Origins', releasedOn: new Date('2017-01-01'), year: 2017}}, tags: ['12', '2017']},
  { _id: 13, name: 'Aya', age: 140, isAlive: true, dob: new Date('1987-01-01'), meta: { game: { name: 'Assassins Creed Origins', releasedOn: new Date('2017-01-01'), year: 2017}}, tags: ['13', '2017']},
];
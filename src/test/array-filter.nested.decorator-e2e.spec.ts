import { INestApplication } from '@nestjs/common';
import { createTestAppModule, sampleArrayData } from './test-helper';
import request from 'supertest';

describe('E2e tests related to the ArrayFilter ParamDecorator, for nested object', () => {
  let app: INestApplication;
  let resultArray: any[];

  beforeAll(async () => {
    app = await createTestAppModule();
    resultArray = sampleArrayData;
    resultArray.map((item) => {
      item.dob = item.dob.toISOString();
      if(item.meta.game?.releasedOn) {
        item.meta.game.releasedOn = item.meta.game.releasedOn.toISOString();
      }
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Test for nested object
  // Test for string type filters
  // Operators.eq, Operators.ne, Operators.in, Operators.nin, Operators.regex
  // filter = { 'meta.game.name': 'Assassins Creed Odyssey' }

  it('Filters for nested object, string equality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.name=string.eq.Assassins%20Creed%20Odyssey').expect(200).expect(
        resultArray.filter((item) => item.meta.game && item.meta.game.name === 'Assassins Creed Odyssey')
      );
  });

  it('Filters for nested object, string inequality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.name=string.ne.Assassins%20Creed%20Odyssey').expect(200).expect(
        resultArray.filter((item) => item.meta.game && item.meta.game.name !== 'Assassins Creed Odyssey')
      );
  });

  it('Filters for nested object, string in', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.name=string.in.Assassins%20Creed%20Odyssey,Assassins%20Creed%20Origins').expect(200).expect(
        resultArray.filter((item) => item.meta.game && ['Assassins Creed Odyssey', 'Assassins Creed Origins'].includes(item.meta.game.name))
      );
  });

  it('Filters for nested object, string not in', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.name=string.nin.Assassins%20Creed%20Odyssey,Assassins%20Creed%20Origins').expect(200).expect(
        resultArray.filter((item) => item.meta.game && !['Assassins Creed Odyssey', 'Assassins Creed Origins'].includes(item.meta.game.name))
      );
  });

  it('Filters for nested object, string contains', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.name=string.regex.Syndicate').expect(200).expect(
        resultArray.filter((item) => item.meta.game && item.meta.game.name.includes('Syndicate'))
      );
  });

  // Test for nested object
  // Test for number type filters
  // Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte, Operators.in, Operators.nin

  it('Filters for nested object, number eq', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.year=number.eq.2015').expect(200).expect(
        resultArray.filter((item) => item.meta.game && item.meta.game.year === 2015)
      );
  });

  it('Filters for nested object, number ne', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.year=number.ne.2015').expect(200).expect(
        resultArray.filter((item) => item.meta.game && item.meta.game.year !== 2015)
      );
  });

  it('Filters for nested object, number gt', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.year=number.gt.2015').expect(200).expect(
        resultArray.filter((item) => item.meta.game && item.meta.game.year > 2015)
      );
  });

  it('Filters for nested object, number gte', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.year=number.gte.2015').expect(200).expect(
        resultArray.filter((item) => item.meta.game && item.meta.game.year >= 2015)
      );
  });

  it('Filters for nested object, number lt', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.year=number.lt.2015').expect(200).expect(
        resultArray.filter((item) => item.meta.game && item.meta.game.year < 2015)
      );
  });

  it('Filters for nested object, number lte', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.year=number.lte.2015').expect(200).expect(
        resultArray.filter((item) => item.meta.game && item.meta.game.year <= 2015)
      );
  });

  it('Filters for nested object, number in', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.year=number.in.2015,2016,2017').expect(200).expect(
        resultArray.filter((item) => item.meta.game && [2015, 2016, 2017].includes(item.meta.game.year))
      );
  });

  it('Filters for nested object, number not in', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.year=number.nin.2015,2016,2017').expect(200).expect(
        resultArray.filter((item) => item.meta.game && ![2015, 2016, 2017].includes(item.meta.game.year))
      );
  });

  // Test for nested object
  // Test for date type filters
  // Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte, Operators.in, Operators.nin

  it('Filters for nested object, date eq', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.releasedOn=date.eq.2015-01-01').expect(200).expect(
        resultArray.filter((item) => item.meta.game && (new Date(item.meta.game.releasedOn)).getTime() === (new Date('2015-01-01')).getTime())
      );
  });

  it('Filters for nested object, date ne', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.releasedOn=date.ne.2015-01-01').expect(200).expect(
        resultArray.filter((item) => item.meta.game && (new Date(item.meta.game.releasedOn)).getTime() !== (new Date('2015-01-01')).getTime())
      );
  });

  it('Filters for nested object, date gt', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.releasedOn=date.gt.2015-01-01').expect(200).expect(
        resultArray.filter((item) => item.meta.game && (new Date(item.meta.game.releasedOn)).getTime() > (new Date('2015-01-01')).getTime())
      );
  });

  it('Filters for nested object, date gte', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.releasedOn=date.gte.2015-01-01').expect(200).expect(
        resultArray.filter((item) => item.meta.game && (new Date(item.meta.game.releasedOn)).getTime() >= (new Date('2015-01-01')).getTime())
      );
  });

  it('Filters for nested object, date lt', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.releasedOn=date.lt.2015-01-01').expect(200).expect(
        resultArray.filter((item) => item.meta.game && (new Date(item.meta.game.releasedOn)).getTime() < (new Date('2015-01-01')).getTime())
      );
  });

  it('Filters for nested object, date lte', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.meta.game.releasedOn=date.lte.2015-01-01').expect(200).expect(
        resultArray.filter((item) => item.meta.game && (new Date(item.meta.game.releasedOn)).getTime() <= (new Date('2015-01-01')).getTime())
      );
  });

});
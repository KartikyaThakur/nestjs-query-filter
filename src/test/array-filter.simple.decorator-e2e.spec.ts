import { INestApplication } from '@nestjs/common';
import { createTestAppModule, sampleArrayData } from './test-helper';
import request from 'supertest';

describe('E2e tests related to the ArrayFilter ParamDecorator', () => {
  let app: INestApplication;
  let resultArray: any[];

  beforeAll(async () => {
    app = await createTestAppModule();
    resultArray = sampleArrayData;
    resultArray.map((item) => {
      item.dob = item.dob.toISOString();
      item.meta.game.releasedOn = item.meta.game.releasedOn.toISOString();
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Test for no filters
  it('No filters', async () => {
    await request(app.getHttpServer())
      .get('/array-data').expect(200).expect(
        resultArray
      );
  });

  // Test for string type filters
  // Operators.eq, Operators.ne, Operators.in, Operators.nin, Operators.regex

  it('Filters for string equality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.eq.Ezio%20Auditore').expect(200).expect(
        resultArray.filter((item) => item.name === 'Ezio Auditore')
      );
  });

  it('Filters for string inequality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.ne.Ezio%20Auditore').expect(200).expect(
        resultArray.filter((item) => item.name !== 'Ezio Auditore')
      );
  });

  it('Filters for string in', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.in.Ezio%20Auditore,Altair%20Ibn-La%27Ahad').expect(200).expect(
        resultArray.filter((item) => ['Ezio Auditore', 'Altair Ibn-La\'Ahad'].includes(item.name))
      );
  });

  it('Filters for string nin', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.nin.Ezio%20Auditore,Altair%20Ibn-La%27Ahad').expect(200).expect(
        resultArray.filter((item) => !['Ezio Auditore', 'Altair Ibn-La\'Ahad'].includes(item.name))
      );
  });

  it('Filters for string regex', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.regex.Ezio').expect(200).expect(
        resultArray.filter((item) => item.name.match(/Ezio/))
      );
  });

  // Test for number type filters
  // Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte, Operators.in, Operators.nin

  it('Filters for number equality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.eq.20').expect(200).expect(
        resultArray.filter((item) => item.age === 20)
      );
  });

  it('Filters for number inequality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.ne.20').expect(200).expect(
        resultArray.filter((item) => item.age !== 20)
      );
  });

  it('Filters for number greater than', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.gt.20').expect(200).expect(
        resultArray.filter((item) => item.age > 20)
      );
  });

  it('Filters for number greater than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.gte.20').expect(200).expect(
        resultArray.filter((item) => item.age >= 20)
      );
  });

  it('Filters for number less than', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.lt.20').expect(200).expect(
        resultArray.filter((item) => item.age < 20)
      );
  });

  it('Filters for number less than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.lte.20').expect(200).expect(
        resultArray.filter((item) => item.age <= 20)
      );
  });

  it('Filters for number in', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.in.20,26').expect(200).expect(
        resultArray.filter((item) => [20, 26].includes(item.age))
      );
  });

  it('Filters for number nin', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.nin.20,26').expect(200).expect(
        resultArray.filter((item) => ![20, 26].includes(item.age))
      );
  });

  // Test for boolean type filters
  // Operators.eq, Operators.ne

  it('Filters for boolean equality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.isAlive=boolean.eq.true').expect(200).expect(
        resultArray.filter((item) => item.isAlive === true)
      );
  });

  it('Filters for boolean inequality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.isAlive=boolean.ne.true').expect(200).expect(
        resultArray.filter((item) => item.isAlive !== true)
      );
  });

  // Test for date type filters
  // Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte

  it('Filters for date equality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.eq.1995-07-21').expect(200).expect(
        resultArray.filter((item) => (new Date(item.dob)).getTime() === (new Date('1995-07-21')).getTime())
      );
  });

  it('Filters for date inequality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.ne.1995-07-21').expect(200).expect(
        resultArray.filter((item) => (new Date(item.dob)).getTime() !== (new Date('1995-07-21')).getTime())
      );
  });

  it('Filters for date greater than', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.gt.1995-07-21').expect(200).expect(
        resultArray.filter((item) => (new Date(item.dob)).getTime() > (new Date('1995-07-21')).getTime())
      );
  });

  it('Filters for date greater than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.gte.1995-07-21').expect(200).expect(
        resultArray.filter((item) => (new Date(item.dob)).getTime() >= (new Date('1995-07-21')).getTime())
      );
  });

  it('Filters for date less than', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.lt.1995-07-21').expect(200).expect(
        resultArray.filter((item) => (new Date(item.dob)).getTime() < (new Date('1995-07-21')).getTime())
      );
  });

  it('Filters for date less than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.lte.1995-07-21').expect(200).expect(
        resultArray.filter((item) => (new Date(item.dob)).getTime() <= (new Date('1995-07-21')).getTime())
      );
  });

  // Test for multiple filter types
  // filter = { name: 'Ezio Auditore', age: 20, isAlive: true, dob: '1995-07-21' }

  it('Filters for multiple filter types', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.eq.Ezio%20Auditore&filter.age=number.in.20,30,40,50,60&filter.isAlive=boolean.eq.true&filter.dob=date.eq.1999-01-01').expect(200).expect(
        resultArray.filter((item) => item.name === 'Ezio Auditore' && [20, 30, 40, 50, 60].includes(item.age) && item.isAlive === true && (new Date(item.dob)).getTime() === (new Date('1999-01-01')).getTime())
      );
  });

  // Test for multiple filters for the same field
  // filter = { age: { $in: [40, 50], $ne: 42 } }

  it('Filters for multiple filters for the same field', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.in.40,50&filter.age=number.ne.42').expect(200).expect(
        resultArray.filter((item) => [40, 50].includes(item.age) && item.age !== 42)
      );
  });

  // Test for multiple filters for the same field, along with filters for other fields
  // filter = { name: 'Ezio Auditore', age: { $in: [40, 50], $ne: 42 } }

  it('Filters for multiple filters for the same field, along with filters for other fields', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.eq.Ezio%20Auditore&filter.age=number.in.20,30,40,50&filter.age=number.ne.42').expect(200).expect(
        resultArray.filter((item) => item.name === 'Ezio Auditore' && [20, 30, 40, 50].includes(item.age) && item.age !== 42)
      );
  });

  // Test for bad filter type

  it('Filters for bad filter type', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=badFilter.eq.Ezio%20Auditore').expect(200).expect(
        resultArray
      );
  });

  // Test for bad operator type

  it('Filters for bad filter type', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.badOperator.Ezio%20Auditore').expect(200).expect(
        resultArray
      );
  });


});
import { INestApplication } from '@nestjs/common';
import { createTestAppModule } from './test-helper';
import request from 'supertest';

describe('E2e tests related to the ORMFilter ParamDecorator', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestAppModule();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Test for no filters
  it('No filters', async () => {
    await request(app.getHttpServer())
      .get('/orm-data').expect(200).expect(
        {}
      );
  });

  // Test for string type filters
  // Operators.eq, Operators.ne, Operators.in, Operators.nin, Operators.regex

  it('Filters for string equality', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.name=string.eq.Ezio%20Auditore').expect(200).expect(
        JSON.stringify({ name: { '$eq': 'Ezio Auditore' } })
      );
  });

  it('Filters for string inequality', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.name=string.ne.Ezio%20Auditore').expect(200).expect(
        JSON.stringify({ name: { '$ne': 'Ezio Auditore' } })
      );
  });

  it('Filters for string in', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.name=string.in.Ezio%20Auditore,Altair%20Ibn-La%27Ahad').expect(200).expect(
        JSON.stringify({ name: { '$in': ['Ezio Auditore', 'Altair Ibn-La\'Ahad'] } })
      );
  });

  it('Filters for string nin', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.name=string.nin.Ezio%20Auditore,Altair%20Ibn-La%27Ahad').expect(200).expect(
        JSON.stringify({ name: { '$nin': ['Ezio Auditore', 'Altair Ibn-La\'Ahad'] } })
      );
  });

  it('Filters for string regex', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.name=string.regex.Ezio').expect(200).expect(
        JSON.stringify({ name: { '$regex': /Ezio/i } })
      );
  });

  // Test for number type filters
  // Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte, Operators.in, Operators.nin

  it('Filters for number equality', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.age=number.eq.20').expect(200).expect(
        JSON.stringify({ age: { '$eq': 20 } })
      );
  });

  it('Filters for number inequality', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.age=number.ne.20').expect(200).expect(
        JSON.stringify({ age: { '$ne': 20 } })
      );
  });

  it('Filters for number greater than', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.age=number.gt.20').expect(200).expect(
        JSON.stringify({ age: { '$gt': 20 } })
      );
  });

  it('Filters for number greater than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.age=number.gte.20').expect(200).expect(
        JSON.stringify({ age: { '$gte': 20 } })
      );
  });

  it('Filters for number less than', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.age=number.lt.20').expect(200).expect(
        JSON.stringify({ age: { '$lt': 20 } })
      );
  });

  it('Filters for number less than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.age=number.lte.20').expect(200).expect(
        JSON.stringify({ age: { '$lte': 20 } })
      );
  });

  it('Filters for number in', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.age=number.in.20,26').expect(200).expect(
        JSON.stringify({ age: { '$in': [20, 26] } })
      );
  });

  it('Filters for number nin', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.age=number.nin.20,26').expect(200).expect(
        JSON.stringify({ age: { '$nin': [20, 26] } })
      );
  });

  // Test for boolean type filters
  // Operators.eq, Operators.ne

  it('Filters for boolean equality', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.isAlive=boolean.eq.true').expect(200).expect(
        JSON.stringify({ isAlive: { '$eq': true } })
      );
  });

  it('Filters for boolean inequality', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.isAlive=boolean.ne.true').expect(200).expect(
        JSON.stringify({ isAlive: { '$ne': true } })
      );
  });

  // Test for date type filters
  // Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte

  it('Filters for date equality', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.dob=date.eq.1995-07-21').expect(200).expect(
        JSON.stringify({ dob: { '$eq': '1995-07-21T00:00:00.000Z' } })
      );
  });

  it('Filters for date inequality', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.dob=date.ne.1995-07-21').expect(200).expect(
        JSON.stringify({ dob: { '$ne': '1995-07-21T00:00:00.000Z' } })
      );
  });

  it('Filters for date greater than', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.dob=date.gt.1995-07-21').expect(200).expect(
        JSON.stringify({ dob: { '$gt': '1995-07-21T00:00:00.000Z' } })
      );
  });

  it('Filters for date greater than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.dob=date.gte.1995-07-21').expect(200).expect(
        JSON.stringify({ dob: { '$gte': '1995-07-21T00:00:00.000Z' } })
      );
  });

  it('Filters for date less than', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.dob=date.lt.1995-07-21').expect(200).expect(
        JSON.stringify({ dob: { '$lt': '1995-07-21T00:00:00.000Z' } })
      );
  });

  it('Filters for date less than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.dob=date.lte.1995-07-21').expect(200).expect(
        JSON.stringify({ dob: { '$lte': '1995-07-21T00:00:00.000Z' } })
      );
  });

  // Test for multiple filter types
  // filter = { name: 'Ezio Auditore', age: 20, isAlive: true, dob: '1995-07-21' }

  it('Filters for multiple filter types', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.name=string.eq.Ezio%20Auditore&filter.age=number.in.20,30,40,50,60&filter.isAlive=boolean.eq.true&filter.dob=date.eq.1999-01-01').expect(200).expect(
        JSON.stringify({ name: { '$eq': 'Ezio Auditore' }, age: { '$in': [20, 30, 40, 50, 60] }, isAlive: { '$eq': true }, dob: { '$eq': '1999-01-01T00:00:00.000Z' } })
      );
  });

  // Test for multiple filters for the same field
  // filter = { age: { $in: [40, 50], $ne: 42 } }

  it('Filters for multiple filters for the same field', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.age=number.in.40,50&filter.age=number.ne.42').expect(200).expect(
        JSON.stringify({ age: { '$in': [40, 50], '$ne': 42 } })
      );
  });

  // Test for multiple filters for the same field, along with filters for other fields
  // filter = { name: 'Ezio Auditore', age: { $in: [40, 50], $ne: 42 } }

  it('Filters for multiple filters for the same field, along with filters for other fields', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.name=string.eq.Ezio%20Auditore&filter.age=number.in.20,30,40,50&filter.age=number.ne.42').expect(200).expect(
        JSON.stringify({ name: { '$eq': 'Ezio Auditore' }, age: { '$in': [20, 30, 40, 50], '$ne': 42 } })
      );
  });

  // Test for bad filter type

  it('Filters for bad filter type', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.name=badFilter.eq.Ezio%20Auditore').expect(200).expect(
        JSON.stringify({ name: { '$eq': 'Ezio Auditore' } })
      );
  });

  // Test for bad operator type

  it('Filters for bad filter type', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.name=string.badOperator.Ezio%20Auditore').expect(200).expect(
        {}
      );
  });

});
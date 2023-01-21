import { INestApplication } from '@nestjs/common';
import { createTestAppModule } from './test-helper';
import request from 'supertest';

describe('E2e tests related to the ArrayFilter ParamDecorator', () => {
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
      .get('/array-data').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() },
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  // Test for string type filters
  // Operators.eq, Operators.ne, Operators.in, Operators.nin, Operators.regex

  it('Filters for string equality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.eq.Ezio%20Auditore').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for string inequality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.ne.Ezio%20Auditore').expect(200).expect(
        [
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for string in', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.in.Ezio%20Auditore,Altair%20Ibn-La%27Ahad').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() },
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for string nin', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.nin.Ezio%20Auditore,Altair%20Ibn-La%27Ahad').expect(200).expect(
        [
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for string regex', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.regex.Ezio').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() }
        ]
      );
  });

  // Test for number type filters
  // Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte, Operators.in, Operators.nin

  it('Filters for number equality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.eq.20').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for number inequality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.ne.20').expect(200).expect(
        [
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for number greater than', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.gt.20').expect(200).expect(
        [
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for number greater than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.gte.20').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() },
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for number less than', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.lt.20').expect(200).expect(
        [
          // Empty
        ]
      );
  });

  it('Filters for number less than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.lte.20').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for number in', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.in.20,26').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for number nin', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.nin.20,26').expect(200).expect(
        [
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  // Test for boolean type filters
  // Operators.eq, Operators.ne

  it('Filters for boolean equality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.isAlive=boolean.eq.true').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for boolean inequality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.isAlive=boolean.ne.true').expect(200).expect(
        [
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() }
        ]
      );
  });

  // Test for date type filters
  // Operators.eq, Operators.ne, Operators.gt, Operators.gte, Operators.lt, Operators.lte

  it('Filters for date equality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.eq.1995-07-21').expect(200).expect(
        [
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() }
        ]
      );
  });

  it('Filters for date inequality', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.ne.1995-07-21').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() },
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for date greater than', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.gt.1995-07-21').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() },
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for date greater than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.gte.1995-07-21').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() },
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() }
        ]
      );
  });

  it('Filters for date less than', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.lt.1995-07-21').expect(200).expect(
        [
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  it('Filters for date less than or equal to', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.dob=date.lte.1995-07-21').expect(200).expect(
        [
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  // Test for multiple filter types
  // filter = { name: 'Ezio Auditore', age: 20, isAlive: true, dob: '1995-07-21' }

  it('Filters for multiple filter types', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.eq.Ezio%20Auditore&filter.age=number.in.20,30,40,50,60&filter.isAlive=boolean.eq.true&filter.dob=date.eq.1999-01-01').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() }
        ]
      );
  });

  // Test for multiple filters for the same field
  // filter = { age: { $in: [40, 50], $ne: 42 } }

  it('Filters for multiple filters for the same field', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.age=number.in.40,50&filter.age=number.ne.42').expect(200).expect(
        [
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() }
        ]
      );
  });

  // Test for multiple filters for the same field, along with filters for other fields
  // filter = { name: 'Ezio Auditore', age: { $in: [40, 50], $ne: 42 } }

  it('Filters for multiple filters for the same field, along with filters for other fields', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.eq.Ezio%20Auditore&filter.age=number.in.20,30,40,50&filter.age=number.ne.42').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() }
        ]
      );
  });

  // Test for bad filter type

  it('Filters for bad filter type', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=badFilter.eq.Ezio%20Auditore').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() },
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });

  // Test for bad operator type

  it('Filters for bad filter type', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.name=string.badOperator.Ezio%20Auditore').expect(200).expect(
        [
          { id: 1, name: 'Ezio Auditore', age: 20, isAlive: true, dob: (new Date('1999-01-01')).toISOString() },
          { id: 2, name: 'Altair Ibn-La\'Ahad', age: 30, isAlive: false, dob: (new Date('1998-01-01')).toISOString() },
          { id: 3, name: 'Connor Kenway', age: 40, isAlive: true, dob: (new Date('1997-01-01')).toISOString() },
          { id: 4, name: 'Edward Kenway', age: 50, isAlive: false, dob: (new Date('1996-01-01')).toISOString() },
          { id: 5, name: 'Aveline de Grandpré', age: 60, isAlive: true, dob: (new Date('1995-07-21')).toISOString() },
          { id: 6, name: 'Kassandra', age: 70, isAlive: false, dob: (new Date('1994-01-01')).toISOString() },
          { id: 7, name: 'Alexios', age: 80, isAlive: true, dob: (new Date('1993-01-01')).toISOString() },
          { id: 8, name: 'Shay Cormac', age: 90, isAlive: false, dob: (new Date('1992-01-01')).toISOString() },
          { id: 9, name: 'Arno Dorian', age: 100, isAlive: true, dob: (new Date('1991-01-01')).toISOString() },
          { id: 10, name: 'Jacob Frye', age: 110, isAlive: false, dob: (new Date('1990-01-01')).toISOString() },
          { id: 11, name: 'Evie Frye', age: 120, isAlive: true, dob: (new Date('1989-01-01')).toISOString() },
          { id: 12, name: 'Bayek of Siwa', age: 130, isAlive: false, dob: (new Date('1988-01-01')).toISOString() },
          { id: 13, name: 'Aya', age: 140, isAlive: true, dob: (new Date('1987-01-01')).toISOString() }
        ]
      );
  });


});
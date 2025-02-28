import { INestApplication } from '@nestjs/common';
import { createTestAppModule } from './test-helper';
import request from 'supertest';

describe('E2e tests related to the ORMFilter ParamDecorator, for discovered edge cases', () => {
  let app: INestApplication;

  beforeAll(async () => {
    Object.defineProperty(RegExp.prototype, "toJSON", {
      value: RegExp.prototype.toString
    });
    app = await createTestAppModule();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });


  // Test for email, which leads to catering to [.] character in the search term
  it('Filters for fields with . in the search term', async () => {
    await request(app.getHttpServer())
      .get('/orm-data?filter.email=string.regex.ezio.auditor').expect(200).expect(
        JSON.stringify({ email: { '$regex': /ezio.auditor/i } })
      );
  });
  
});
import { INestApplication } from '@nestjs/common';
import { createTestAppModule, sampleArrayData } from './test-helper';
import request from 'supertest';

describe('E2e tests related to the ArrayFilter ParamDecorator, for discovered edge cases', () => {
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

  // Test for email, which leads to catering to [.] character in the search term
  it('Filters for fields with . in the search term', async () => {
    await request(app.getHttpServer())
      .get('/array-data?filter.email=string.regex.ezio.auditor').expect(200).expect(
        resultArray.filter((item) => item.email.match(/ezio.auditor/i))
      );
  });

});
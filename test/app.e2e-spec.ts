import { INestApplication } from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import appImports from '../src/app.imports';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule(
      {
        imports: appImports,
      },
    ).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: '{games{start, id}}',
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

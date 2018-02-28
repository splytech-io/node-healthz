'use strict';

import * as supertest from 'supertest';
import { Healthz } from './healthz';

describe('unit-tests', () => {
  const app = new Healthz();

  it('should setup initial state', async function () {
    await supertest(app.callback()).get('/healthz').expect(200);
    await supertest(app.callback()).get('/healthy').expect(503);
  });

  it('should setReady(true)', async function () {
    app.setReady(true);

    await supertest(app.callback()).get('/healthz').expect(200);
    await supertest(app.callback()).get('/healthy').expect(200);
  });

  it('should setLive(true)', async function () {
    app.setLive(true);

    await supertest(app.callback()).get('/healthz').expect(200);
    await supertest(app.callback()).get('/healthy').expect(200);
  });

  it('should setLive(false)', async function () {
    app.setLive(false);

    await supertest(app.callback()).get('/healthz').expect(503);
    await supertest(app.callback()).get('/healthy').expect(200);
  });

  it('should setReady(false)', async function () {
    app.setReady(false);

    await supertest(app.callback()).get('/healthz').expect(503);
    await supertest(app.callback()).get('/healthy').expect(503);
  });
});

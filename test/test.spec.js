'use strict';

process.env.HEALTHZ_ENABLE = 0;

const request = require('supertest');
const app = require('../src/healthz');

describe('unit-tests', () => {

  it('should setup initial state', async function () {
    await request(app.callback()).get('/healthz').expect(200);
    await request(app.callback()).get('/healthy').expect(503);
  });

  it('should setReady(true)', async function () {
    app.setReady(true);

    await request(app.callback()).get('/healthz').expect(200);
    await request(app.callback()).get('/healthy').expect(200);
  });

  it('should setLive(true)', async function () {
    app.setLive(true);

    await request(app.callback()).get('/healthz').expect(200);
    await request(app.callback()).get('/healthy').expect(200);
  });

  it('should setLive(false)', async function () {
    app.setLive(false);

    await request(app.callback()).get('/healthz').expect(503);
    await request(app.callback()).get('/healthy').expect(200);
  });

  it('should setReady(false)', async function () {
    app.setReady(false);

    await request(app.callback()).get('/healthz').expect(503);
    await request(app.callback()).get('/healthy').expect(503);
  });

});

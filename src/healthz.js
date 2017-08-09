'use strict';

const Koa = require('koa');
const config = require('@rainder/config');

const CONFIG = config.init({
  ENABLE: 'healthz.enable',
  PORT: 'healthz.port',
});

module.exports = new class Healthz extends Koa {
  /**
   *
   */
  constructor() {
    super();

    this.live = true;
    this.ready = false;

    this.listen();
    this.use(Healthz.probe('/healthz', () => this.live));
    this.use(Healthz.probe('/healthy', () => this.ready));
  }

  /**
   *
   * @param path
   * @param getter
   * @returns {function(*, *)}
   */
  static probe(path, getter) {
    return (ctx, next) => {
      if (ctx.path !== path) {
        return next();
      }

      if (getter() === true) {
        ctx.status = 200;
        ctx.body = 'ok';
      } else {
        ctx.status = 503;
        ctx.body = 'maintenance';
      }
    };
  }

  /**
   *
   * @param value
   * @returns {Healthz}
   */
  setReady(value = true) {
    this.ready = value;

    return this;
  }

  /**
   *
   * @param value
   * @returns {Healthz}
   */
  setLive(value = true) {
    this.live = value;

    return this;
  }

  /**
   *
   */
  listen() {
    if (`${CONFIG.ENABLE}` !== 'true') {
      return;
    }

    super.listen(CONFIG.PORT, (err) => {
      if (err) {
        throw err;
      }

      console.log(`HTTP Health check is listening on 0.0.0.0:${CONFIG.PORT}`);
    });
  }
};

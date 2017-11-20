'use strict';

import { Server } from 'http';
import * as Koa from 'koa';
import * as config from 'config';

const CONFIG = {
  ENABLE: config.get('healthz.enable'),
  PORT: config.get('healthz.port'),
};

export class Healthz extends Koa {
  live = true;
  ready = false;
  /**
   *
   */
  constructor() {
    super();

    this.start();
    this.use(Healthz.probe('/healthz', () => this.live));
    this.use(Healthz.probe('/healthy', () => this.ready));
  }

  /**
   *
   * @param path
   * @param getter
   * @returns {function(*, *)}
   */
  static probe(path: string, getter: () => boolean) {
    return (ctx: Koa.Context, next: Function) => {
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
  start(): Server|undefined {
    if (`${CONFIG.ENABLE}` !== 'true') {
      return;
    }

    return super.listen(CONFIG.PORT, () =>
      /*tslint:disable-next-line*/
      console.log(`HTTP Health check is listening on 0.0.0.0:${CONFIG.PORT}`)
    );
  }
}

export default new Healthz();


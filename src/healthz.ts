'use strict';

import { Server } from 'http';
import Application = require('koa');

export class Healthz extends Application {
  private live = true;
  private ready = false;
  private server?: Server;

  /**
   *
   */
  constructor(public port: number = 7020, public host: string = '0.0.0.0') {
    super();

    this.use(Healthz.probe('/healthz', () => this.live));
    this.use(Healthz.probe('/healthy', () => this.ready));
  }

  /**
   *
   * @param {string} path
   * @param {() => boolean} getter
   * @returns {(ctx: Application.Context, next: Function) => any}
   */
  static probe(path: string, getter: () => boolean) {
    return (ctx: Application.Context, next: Function) => {
      if (ctx.path !== path) {
        return next();
      }

      if (getter()) {
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
   * @param {boolean} value
   * @returns {this}
   */
  setReady(value = true) {
    this.ready = value;

    return this;
  }

  /**
   *
   * @param {boolean} value
   * @returns {this}
   */
  setLive(value = true) {
    this.live = value;

    return this;
  }

  /**
   *
   * @returns {Promise<"http".Server>}
   */
  async start(): Promise<Server> {
    return new Promise<Server>(((resolve) => {
      this.server = super.listen(this.port, this.host, () => {
        resolve(this.server);
      });
    }));
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async stop(): Promise<void> {
    await new Promise((resolve, reject) => {
      if (!this.server) {
        return reject(new Error('not started'));
      }

      this.server.close((err: any) => err ? reject(err) : resolve());
    });
  }
}


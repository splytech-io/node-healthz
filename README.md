# Kubernetes health check server

Listens to 7020 http port. Configurable through `config` file.

```js
const healthz = require('@splytech-io/healthz');

// - call whenever server is ready to accept connections
healthz.setReady(true);

// - used to set liveness probe
healthz.setLive(true);
```


## Config file definition

default.yml

```yaml
healthz:
  enable: true
  port: 7020
```

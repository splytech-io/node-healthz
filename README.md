# Kubernetes health check server

Exposes `/healthy` (readiness probe) and `/healthz` (liveness probe) endpoints which can be used by Kubernetes.


```js
import { Healthz } from '@splytech-io/healthz';

const healthz = new Healthz(7020, '0.0.0.0');

// - call whenever server is ready to accept connections
healthz.setReady(true);

// - used to set liveness probe
healthz.setLive(true);
```

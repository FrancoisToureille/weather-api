import type { Express } from 'express';
import { createApplicationContainer } from './composition/container';

const port = Number(process.env.PORT ?? 3000);
const app = createApplicationContainer().resolve<Express>('app');

app.listen(port, () => {
  console.log(`Weather API listening on port ${port}`);
});
import express, { ErrorRequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';
import { AddressNotFoundError, GetWeatherByAddress } from '../../../application/get-weather';
import { DemoWeather } from '../../../application/demo-weather';
import { openApiSpecification } from './swagger';
import { toWeatherHttpResponse } from './weather-response-adapter';

export function createApp(getWeatherByAddress: GetWeatherByAddress, demoWeather: DemoWeather) {
  const app = express();

  app.get('/docs.json', (_request, response) => response.json(openApiSpecification));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecification));

  app.get(['/weather', '/forecast'], async (request, response, next) => {
    const address = typeof request.query.address === 'string' ? request.query.address.trim() : '';
    const demo = request.query.demo === 'true';

    if (!address) {
      response.status(400).json({ error: 'Query parameter "address" is required' });
      return;
    }

    try {
      const forecast = demo
        ? await demoWeather.execute(address)
        : await getWeatherByAddress.execute(address);
      response.json(toWeatherHttpResponse(forecast));
    } catch (error) {
      next(error);
    }
  });

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof AddressNotFoundError) {
      response.status(404).json({ error: error.message });
      return;
    }

    response.status(502).json({ error: 'An external weather service is unavailable' });
  };

  app.use(errorHandler);
  return app;
}
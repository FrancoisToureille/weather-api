export const openApiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'Weather API',
    version: '1.0.0',
    description: 'Obtient les prévisions météo horaires à partir d’une adresse postale.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/weather': {
      get: {
        summary: 'Obtenir les prévisions météo d’une adresse',
        parameters: [{
          name: 'address',
          in: 'query',
          required: true,
          description: 'Adresse ou nom de lieu à géocoder.',
          schema: { type: 'string', example: 'Paris' },
        }],
        responses: {
          '200': {
            description: 'Prévisions météo trouvées.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/WeatherForecast' } } },
          },
          '400': { description: 'Le paramètre address est absent ou vide.' },
          '404': { description: 'Aucun lieu correspondant trouvé.' },
          '502': { description: 'Un service météo externe est indisponible.' },
        },
      },
    },
  },
  components: {
    schemas: {
      WeatherForecast: {
        type: 'object',
        required: ['address', 'latitude', 'longitude', 'timezone', 'hourly'],
        properties: {
          address: { type: 'string', example: 'Paris, France' },
          latitude: { type: 'number', example: 48.8566 },
          longitude: { type: 'number', example: 2.3522 },
          timezone: { type: 'string', example: 'Europe/Paris' },
          hourly: { type: 'object', description: 'Données horaires retournées par Open-Meteo.', additionalProperties: true },
        },
      },
    },
  },
} as const;
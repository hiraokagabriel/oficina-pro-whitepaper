import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Oficina PRO ERP API',
      version: '1.0.0',
      description: 'API para Sistema de Gestão de Oficina Mecânica',
      contact: {
        name: 'Gabriel Hiraoka',
        email: 'hiraokagabriel@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.oficinapro.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;

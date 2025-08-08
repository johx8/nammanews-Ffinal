const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Namma News API",
      version: "1.0.0",
      description: "API documentation for the Namma News web application",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./routes/*.js"], // Scan all route files for Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

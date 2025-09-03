// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API con Node + Express + MongoDB",
      version: "1.0.0",
      description: "Documentación generada con swagger-jsdoc y swagger-ui-express"
    },
    servers: [
      {
        url: "http://localhost:4000", 
        description: "Servidor local"
      }
    ]
  },
  apis: ["./Rutas/*.js"],  
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

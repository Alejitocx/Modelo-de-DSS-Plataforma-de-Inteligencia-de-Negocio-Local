// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

/**
 * Configuración de Swagger JS Doc para la documentación automática de la API
 * 
 * Este módulo genera la especificación OpenAPI/Swagger para documentar
 * automáticamente todos los endpoints de la API a partir de comentarios JSDoc
 * en los archivos de rutas.
 */

// Opciones de configuración para swagger-jsdoc
const options = {
  definition: {
    // Especificación de OpenAPI 3.0.0
    openapi: "3.0.0",
    info: {
      title: "API con Node + Express + MongoDB", // Título de la API
      version: "1.0.0", // Versión de la API
      description: "Documentación generada con swagger-jsdoc y swagger-ui-express" // Descripción
    },
    servers: [
      {
        url: "http://localhost:4000", // URL base del servidor local
        description: "Servidor local" // Descripción del servidor
      }
      // Nota: En producción, se debería agregar otra entrada con la URL del servidor de producción
    ]
  },
  // Ruta a los archivos que contienen anotaciones OpenAPI (comentarios JSDoc)
  apis: ["./Rutas/*.js"], // Busca en todos los archivos JS en la carpeta Rutas
};

// Generar la especificación Swagger/OpenAPI a partir de las opciones
const swaggerSpec = swaggerJSDoc(options);

// Exportar la especificación para su uso en el servidor principal
module.exports = swaggerSpec;

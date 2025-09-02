📌 Backend - DSS Plataforma de Inteligencia de Negocio Local
📖 Descripción

Este proyecto implementa el backend de un Sistema de Soporte a Decisiones (DSS) orientado a negocios locales.
Su función principal es manejar la lógica de negocio, almacenar y procesar datos provenientes del Yelp Open Dataset, y exponer una API REST que permite a cualquier cliente (ejemplo: un panel en React) consultar información de forma estructurada.

El backend se construyó con Node.js y Express, se conecta a una base de datos MongoDB y cuenta con documentación Swagger para facilitar su consumo.

Este servidor es el núcleo de la plataforma: recibe peticiones del frontend, consulta datos, ejecuta análisis y devuelve resultados listos para ser visualizados.

🎯 Objetivos

Exponer una API robusta y clara para que el frontend pueda consumir los datos.

Procesar información de negocios, reseñas, usuarios, tips y check-ins.

Permitir comparación entre competidores y análisis de atributos relevantes.

Soportar carga de archivos JSON para alimentar la base de datos.

Servir como capa de integración entre los datos crudos de Yelp y la experiencia visual en React.

⚙️ Requerimientos previos

Antes de instalar, asegúrate de tener:

Node.js >= 18

MongoDB instalado localmente o en la nube (Atlas recomendado).

Git para clonar el repositorio.

🚀 Instalación y ejecución

Clonar el repositorio

git clone https://github.com/usuario/DSS-Local-BI.git
cd DSS-Local-BI/backend


Instalar dependencias

npm install


Configurar variables de entorno
Crear un archivo .env en la carpeta backend/ con:

PORT=4000
MONGODB_URI=mongodb://localhost:27017/dss-local


Ejecutar el servidor

npm run dev


Por defecto la API quedará disponible en:

http://localhost:4000/api

📂 Estructura del proyecto
backend/
 ├── src/
 │   ├── models/        # Definición de esquemas Mongoose
 │   ├── routes/        # Endpoints REST
 │   ├── controllers/   # Lógica de negocio
 │   ├── middleware/    # Carga de archivos, validaciones
 │   └── utils/         # Funciones auxiliares
 ├── uploads/           # Archivos cargados (JSON)
 ├── swagger/           # Documentación OpenAPI
 └── server.js          # Entrada principal

📌 Endpoints principales

La API está documentada en Swagger (disponible en /api-docs). Algunos ejemplos:

👤 User

GET /api/user/{id} → detalle de usuario.

GET /api/user?limit=5 → top usuarios más activos.

📝 Review

GET /api/review/business/{businessId} → listar reseñas de un negocio.

GET /api/review/business/{businessId}/avg → promedio de estrellas.

📌 Business

GET /api/business → lista negocios con filtros (city, category, limit).

GET /api/business/{id} → detalle de un negocio.

💡 Tip

GET /api/tip/business/{businessId} → consejos asociados al negocio.

📈 Modelos de Análisis

POST /api/v1/competitors/compare → comparar negocios.

POST /api/v1/attributes/impact → analizar impacto de atributos.

POST /api/v1/metrics/timeseries → generar series de tiempo.

POST /api/v1/metrics/top → ranking Top-N.

POST /api/v1/metrics/kpi → métricas KPI personalizadas.

📝 Ejemplo de uso con cURL

Promedio de estrellas de un negocio:

curl http://localhost:4000/api/review/business/12345/avg


Respuesta:

{
  "businessId": "12345",
  "averageStars": 4.5,
  "totalReviews": 320
}

✅ Estado

Backend funcional y en desarrollo continuo.

Documentación básica lista en Swagger.

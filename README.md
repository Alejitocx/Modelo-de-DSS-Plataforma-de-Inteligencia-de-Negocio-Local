# DSS - Plataforma de Inteligencia de Negocio Local

## 📖 Descripción

Este proyecto es un Modelo de Sistema de Soporte a Decisiones (DSS) diseñado para ayudar a dueños de negocios locales a monitorear y comparar su rendimiento frente a competidores directos en su misma área y categoría.

La plataforma ofrece un panel de control interactivo que muestra:

    📊 Puntuación promedio de calificación a lo largo del tiempo

    🗓️ Volumen de reseñas por mes

    ⭐ Distribución de calificaciones (5 estrellas vs 1 estrella)

    🔎 Análisis de atributos del negocio (ej. "ambiente ruidoso" vs "música de ambiente")

De esta manera, los usuarios pueden identificar fortalezas y debilidades de su negocio y tomar decisiones estratégicas, como mejorar la calidad de productos o invertir en la experiencia del cliente.


## 🏗️ Cómo Funciona

El sistema se compone de un backend robusto construido con Node.js y Express que sirve como API RESTful, conectándose a una base de datos MongoDB para almacenar y gestionar los datos de negocios, reseñas, usuarios y tips. El backend procesa las solicitudes del frontend, aplica lógica de negocio y genera análisis comparativos en tiempo real.

La arquitectura del backend incluye endpoints específicos para:

    Gestión completa de entidades (negocios, reseñas, usuarios, tips)

    Sistema de Soporte a Decisiones (DSS) con métricas avanzadas

    Análisis competitivo y comparativas de rendimiento

    Procesamiento de atributos y características de negocios

Todas las APIs están documentadas con Swagger/OpenAPI, permitiendo una integración sencilla y transparente para los desarrolladores. El sistema utiliza un modelo de datos normalizado que garantiza consistencia y permite consultas complejas para el análisis empresarial.


## 🎯 Objetivos

    Proporcionar una herramienta clara, visualmente atractiva y fácil de usar

    Incorporar conceptos de ergonomía, usabilidad y amigabilidad

    Implementar metodologías de desarrollo de sistemas de información, con planificación, documentación y seguimiento adecuado

    Utilizar estándares de codificación y herramientas de versionamiento (incluyendo para la base de datos)

## ⚙️ Requerimientos Técnicos

    Conexión a API documentada con Swagger, para obtener y almacenar información

    Carga de archivos con estructura predefinida (ej. attributes.json)

    Implementación de tres subsistemas:

        Data Subsystem → Manejo de la información

        Model Subsystem → Procesamiento y análisis de datos

        User Interface Subsystem → Panel interactivo para visualización

## 🚫 Exclusiones

    No se requiere inicio de sesión, autenticación de usuarios ni manejo de roles/perfiles

## 📌 Tecnologías y Herramientas

    Frontend: React

    Backend: Node.js / Express

    Base de Datos: MongoDB con Mongoose ODM

    Documentación de API: Swagger/OpenAPI

    Control de versiones: Git + GitHub

## 📈 Ejemplo de Caso de Uso

Un dueño de café puede descubrir que sus competidores reciben mejores calificaciones por la calidad del café. Gracias al análisis, podrá decidir invertir en granos de mejor calidad o en capacitación para baristas. El sistema backend procesa los datos históricos, compara las tendencias de calificaciones y genera insights accionables que se presentan en el panel de control.


## 📝 Estado del Proyecto

📌 En desarrollo (MVP) - El backend está implementado con APIs funcionales y se encuentra en fase de integración con el frontend.

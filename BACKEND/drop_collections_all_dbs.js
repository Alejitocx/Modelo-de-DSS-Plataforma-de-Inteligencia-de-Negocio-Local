// drop_collections_all_dbs.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

/**
 * Script de administración para MongoDB que elimina colecciones específicas
 * de todas las bases de datos en el servidor.
 * 
 * Propósito:
 * - Limpiar colecciones de datos de prueba o desarrollo
 * - Eliminar colecciones específicas en múltiples bases de datos
 * - Ejecutar en modo de prueba (dry-run) antes de realizar cambios reales
 * 
 * ⚠️ ADVERTENCIA: Este script puede eliminar datos permanentemente.
 * Use con extremo cuidado, especialmente en entornos de producción.
 */

// Configuración de conexión a MongoDB
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Lista de colecciones objetivo a eliminar
const targets = ['checkin', 'negocios', 'reseñas', 'tips', 'usuario'];

/**
 * Normaliza nombres de colecciones para comparación flexible
 * - Convierte a minúsculas
 * - Elimina acentos y caracteres especiales
 * - Elimina guiones, espacios y plurales
 * 
 * @param {string} name - Nombre de la colección a normalizar
 * @returns {string} - Nombre normalizado para comparación
 */
function normalize(name){
  return String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_\s]/g, '')
    .replace(/s$/,'');
}

// Ejecución principal del script
(async () => {
  try {
    await client.connect();
    console.log('Conectado a MongoDB ->', uri);

    // Obtener lista de todas las bases de datos
    const admin = client.db().admin();
    const dbsInfo = await admin.listDatabases();
    const databases = dbsInfo.databases.map(d => d.name).filter(n => n !== 'local'); 
    console.log('Bases detectadas:', databases);

    // Modo de prueba: cuando es true, no se eliminan colecciones
    const DRY_RUN = true; // Cambiar a false para ejecutar eliminación real

    // Procesar cada base de datos
    for (const dbName of databases) {
      const db = client.db(dbName);
      const cols = await db.listCollections().toArray();
      const names = cols.map(c => c.name);
      console.log(`\nDB: ${dbName} -> colecciones:`, names);

      // Crear mapa de nombres normalizados para comparación flexible
      const normMap = new Map();
      for (const n of names) {
        const nn = normalize(n);
        if (!normMap.has(nn)) normMap.set(nn, []);
        normMap.get(nn).push(n);
      }

      // Encontrar colecciones que coincidan con los objetivos
      let candidates = [];
      for (const t of targets) {
        const nt = normalize(t);
        if (normMap.has(nt)) candidates.push(...normMap.get(nt));
        else {
          // Búsqueda flexible por similitud
          for (const [k, v] of normMap.entries()) {
            if (k.includes(nt) || nt.includes(k)) candidates.push(...v);
          }
        }
      }
      candidates = [...new Set(candidates)]; // Eliminar duplicados
      if (candidates.length === 0) continue;

      console.log(`  En ${dbName} -> candidatas:`, candidates);
      
      // Ejecutar en modo de prueba o eliminación real
      if (DRY_RUN) {
        console.log('  DRY_RUN true -> no se borra. Cambia DRY_RUN a false para eliminar.');
      } else {
        for (const name of candidates) {
          try {
            const count = await db.collection(name).countDocuments();
            console.log(`  Borrando ${dbName}.${name} (docs: ${count})...`);
            await db.collection(name).drop();
            console.log(`  ${dbName}.${name} eliminada.`);
          } catch (err) {
            console.error(`  Error borrando ${dbName}.${name}:`, err.message || err);
          }
        }
      }
    }

    console.log('\nProceso finalizado (recuerda cambiar DRY_RUN a false para ejecutar borrado).');
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    await client.close();
  }
})();

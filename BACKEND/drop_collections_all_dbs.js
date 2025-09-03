// drop_collections_all_dbs.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const targets = ['checkin', 'negocios', 'reseñas', 'tips', 'usuario'];

function normalize(name){
  return String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_\s]/g, '')
    .replace(/s$/,'');
}

(async () => {
  try {
    await client.connect();
    console.log('Conectado a MongoDB ->', uri);

    const admin = client.db().admin();
    const dbsInfo = await admin.listDatabases();
    const databases = dbsInfo.databases.map(d => d.name).filter(n => n !== 'local'); 
    console.log('Bases detectadas:', databases);

    const DRY_RUN = true; 

    for (const dbName of databases) {
      const db = client.db(dbName);
      const cols = await db.listCollections().toArray();
      const names = cols.map(c => c.name);
      console.log(`\nDB: ${dbName} -> colecciones:`, names);

      const normMap = new Map();
      for (const n of names) {
        const nn = normalize(n);
        if (!normMap.has(nn)) normMap.set(nn, []);
        normMap.get(nn).push(n);
      }

      let candidates = [];
      for (const t of targets) {
        const nt = normalize(t);
        if (normMap.has(nt)) candidates.push(...normMap.get(nt));
        else {
          for (const [k, v] of normMap.entries()) {
            if (k.includes(nt) || nt.includes(k)) candidates.push(...v);
          }
        }
      }
      candidates = [...new Set(candidates)];
      if (candidates.length === 0) continue;

      console.log(`  En ${dbName} -> candidatas:`, candidates);
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

const dssSpec = {
  openapi: '3.0.3',
  info: { title: 'DSS Local BI', version: '1.0.0' },
  paths: {
    '/api/v1/competitors/compare': { post: { summary: 'Comparar competidores', responses: { '200': { description: 'OK' } } } },
    '/api/v1/attributes/impact':  { post: { summary: 'Impacto de atributos',  responses: { '200': { description: 'OK' } } } },
    '/api/v1/metrics/timeseries': { post: { summary: 'Serie de tiempo',       responses: { '200': { description: 'OK' } } } },
    '/api/v1/metrics/top':        { post: { summary: 'Top-N',                  responses: { '200': { description: 'OK' } } } },
    '/api/v1/metrics/kpi':        { post: { summary: 'KPI',                    responses: { '200': { description: 'OK' } } } },
    '/api/v1/admin/upload-json':  { post: { summary: 'Carga JSON',             responses: { '200': { description: 'OK' } } } }
  }
};
module.exports = { dssSpec };

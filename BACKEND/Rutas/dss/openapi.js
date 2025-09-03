// Rutas/dss/openapi.js
const dssSpec = {
  openapi: '3.0.3',
  info: { title: 'DSS Local BI', version: '1.0.0' },
  tags: [
    { name: 'Competitors' },
    { name: 'Attributes' },
    { name: 'Metrics' },
    { name: 'Admin' }
  ],
  paths: {
    '/api/v1/competitors/compare': {
      post: {
        tags: ['Competitors'],
        summary: 'Comparar competidores (hasta 5)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CompetitorsCompareRequest' },
              example: {
                businessIds: ['64f0c0d4a1b2c3d4e5f6a7b8', '64f0c0d4a1b2c3d4e5f6a7b9'],
                from: '2023-01-01',
                to: '2023-12-31',
                interval: 'month'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Datos listos para Chart.js',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CompetitorsCompareResponse' }
              }
            }
          },
          '400': { description: 'Validación fallida' }
        }
      }
    },

    '/api/v1/attributes/impact': {
      post: {
        tags: ['Attributes'],
        summary: 'Impacto de atributos en la calificación',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AttributesImpactRequest' },
              example: {
                category: 'Cafes',
                geo: { city: 'Phoenix' },
                attributes: ['attributes.NoiseLevel', 'attributes.Music']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Promedio de estrellas y conteo por valor de atributo',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AttributesImpactResponse' }
              }
            }
          },
          '400': { description: 'Validación fallida' }
        }
      }
    },

    '/api/v1/metrics/timeseries': {
      post: {
        tags: ['Metrics'],
        summary: 'Serie temporal agregada',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TimeSeriesRequest' },
              example: {
                collection: 'resenas',
                dateField: 'date',
                op: 'avg',
                valueField: 'stars',
                from: '2023-01-01',
                to: '2023-12-31',
                interval: 'month',
                match: { stars: { $gte: 3 } }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Datos listos para Chart.js (una serie)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChartData' }
              }
            }
          },
          '400': { description: 'Validación fallida' }
        }
      }
    },

    '/api/v1/metrics/top': {
      post: {
        tags: ['Metrics'],
        summary: 'Top-N por agrupación',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TopRequest' },
              example: {
                collection: 'negocios',
                groupBy: 'city',
                op: 'count',
                n: 10,
                match: { state: 'AZ' }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Datos listos para Chart.js (bar)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChartData' }
              }
            }
          },
          '400': { description: 'Validación fallida' }
        }
      }
    },

    '/api/v1/metrics/kpi': {
      post: {
        tags: ['Metrics'],
        summary: 'KPI único',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/KPIRequest' },
              example: {
                collection: 'resenas',
                op: 'avg',
                valueField: 'stars',
                match: {}
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Valor agregado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/KPIResponse' }
              }
            }
          },
          '400': { description: 'Validación fallida' }
        }
      }
    },

    '/api/v1/admin/upload-json': {
      post: {
        tags: ['Admin'],
        summary: 'Carga masiva de documentos JSON en una colección',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['collection', 'data'],
                properties: {
                  collection: { type: 'string', example: 'negocios' },
                  data: {
                    type: 'array',
                    items: { type: 'object', additionalProperties: true },
                    example: [{ name: 'Cafe X', city: 'Phoenix' }]
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Insertados',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { inserted: { type: 'integer', example: 100 } }
                }
              }
            }
          }
        }
      }
    }
  },

  components: {
    schemas: {
      ObjectIdString: {
        type: 'string',
        description: 'Mongo ObjectId como string',
        pattern: '^[a-fA-F0-9]{24}$',
        example: '64f0c0d4a1b2c3d4e5f6a7b8'
      },
      TimeInterval: { type: 'string', enum: ['day', 'week', 'month'] },
      AggOp: { type: 'string', enum: ['count', 'sum', 'avg', 'min', 'max'] },

      ChartDataset: {
        type: 'object',
        properties: {
          label: { type: 'string', example: 'avg(stars)' },
          data: {
            type: 'array',
            items: { type: 'number' },
            example: [4.1, 3.9, 4.2]
          },
          yAxisID: { type: 'string', example: 'y1' }
        }
      },
      ChartData: {
        type: 'object',
        properties: {
          labels: {
            type: 'array',
            items: { type: 'string' },
            example: ['2023-01', '2023-02', '2023-03']
          },
          datasets: {
            type: 'array',
            items: { $ref: '#/components/schemas/ChartDataset' }
          }
        }
      },
      ChartDataIntLabels: {
        type: 'object',
        properties: {
          labels: {
            type: 'array',
            items: { type: 'integer' },
            example: [1, 2, 3, 4, 5]
          },
          datasets: {
            type: 'array',
            items: { $ref: '#/components/schemas/ChartDataset' }
          }
        }
      },

      CompetitorsCompareRequest: {
        type: 'object',
        required: ['businessIds', 'interval'],
        properties: {
          businessIds: {
            type: 'array',
            minItems: 2,
            maxItems: 5,
            items: { $ref: '#/components/schemas/ObjectIdString' }
          },
          from: { type: 'string', format: 'date', example: '2023-01-01' },
          to: { type: 'string', format: 'date', example: '2023-12-31' },
          interval: { $ref: '#/components/schemas/TimeInterval' }
        }
      },
      CompetitorsCompareResponse: {
        type: 'object',
        properties: {
          ratingOverTime: { $ref: '#/components/schemas/ChartData' },
          reviewsOverTime: { $ref: '#/components/schemas/ChartData' },
          ratingDistribution: { $ref: '#/components/schemas/ChartDataIntLabels' }
        }
      },

      AttributesImpactRequest: {
        type: 'object',
        required: ['attributes'],
        properties: {
          category: { type: 'string', example: 'Cafes' },
          geo: {
            type: 'object',
            properties: {
              city: { type: 'string', example: 'Phoenix' },
              state: { type: 'string', example: 'AZ' }
            }
          },
          attributes: {
            type: 'array',
            minItems: 1,
            items: { type: 'string' },
            example: ['attributes.NoiseLevel', 'attributes.Music']
          }
        }
      },
      AttributesImpactRow: {
        type: 'object',
        properties: {
          key: { type: 'string', example: 'attributes.NoiseLevel' },
          value: {
            oneOf: [
              { type: 'string' },
              { type: 'boolean' },
              { type: 'number' },
              { type: 'null' }
            ],
            example: 'loud'
          },
          avgStars: { type: 'number', example: 3.89 },
          count: { type: 'integer', example: 245 }
        }
      },
      AttributesImpactResponse: {
        type: 'object',
        properties: {
          byAttribute: {
            type: 'array',
            items: { $ref: '#/components/schemas/AttributesImpactRow' }
          },
          diff: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                compare: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 2,
                  items: { type: 'string' },
                  example: ['attributes.NoiseLevel', 'attributes.Music']
                },
                delta: { type: 'number', example: -0.27 }
              }
            }
          }
        }
      },

      TimeSeriesRequest: {
        type: 'object',
        required: ['collection', 'dateField', 'op'],
        properties: {
          collection: { type: 'string', example: 'resenas' },
          dateField: { type: 'string', example: 'date' },
          op: { $ref: '#/components/schemas/AggOp' },
          valueField: { type: 'string', example: 'stars' },
          from: { type: 'string', format: 'date', example: '2023-01-01' },
          to: { type: 'string', format: 'date', example: '2023-12-31' },
          interval: { $ref: '#/components/schemas/TimeInterval' },
          match: {
            type: 'object',
            additionalProperties: true,
            example: { stars: { $gte: 4 } }
          }
        }
      },

      TopRequest: {
        type: 'object',
        required: ['collection', 'groupBy', 'op'],
        properties: {
          collection: { type: 'string', example: 'negocios' },
          groupBy: { type: 'string', example: 'city' },
          op: { $ref: '#/components/schemas/AggOp' },
          valueField: { type: 'string', example: 'review_count' },
          n: { type: 'integer', example: 10 },
          match: {
            type: 'object',
            additionalProperties: true,
            example: { state: 'AZ' }
          }
        }
      },

      KPIRequest: {
        type: 'object',
        required: ['collection', 'op'],
        properties: {
          collection: { type: 'string', example: 'resenas' },
          op: { $ref: '#/components/schemas/AggOp' },
          valueField: { type: 'string', example: 'stars' },
          match: {
            type: 'object',
            additionalProperties: true,
            example: {}
          }
        }
      },
      KPIResponse: {
        type: 'object',
        properties: { value: { type: 'number', example: 4.02 } }
      }
    }
  }
};

module.exports = { dssSpec };

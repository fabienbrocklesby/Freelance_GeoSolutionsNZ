module.exports = ({ env }) => {
  const corsOrigins = env.array('CORS_ALLOWED_ORIGINS', ['http://localhost:4321']);
  const corsMethods = env.array(
    'CORS_ALLOWED_METHODS',
    ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
  );
  const corsHeaders = env.array(
    'CORS_ALLOWED_HEADERS',
    ['Content-Type', 'Authorization', 'Origin', 'Accept']
  );

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: corsOrigins,
        methods: corsMethods,
        headers: corsHeaders,
        keepHeaderOnError: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    {
      name: 'strapi::body',
      config: {
        formLimit: '10mb',
        jsonLimit: '10mb',
        textLimit: '10mb',
        formidable: {
          maxFileSize: 25 * 1024 * 1024,
        },
      },
    },
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

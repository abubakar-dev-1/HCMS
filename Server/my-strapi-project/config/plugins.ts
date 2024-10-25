export default ({ strapi }: { strapi: any }) => ({
    // Plugin initialization logic if required
    initialize() {
      strapi.log.info('CKEditor plugin initialized');
    },
  });
  
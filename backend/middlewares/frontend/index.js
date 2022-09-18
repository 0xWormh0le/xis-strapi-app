const path = require("path");
const koaStatic = require("koa-static");
const fs = require("fs");

module.exports = strapi => {
  return {
    async initialize() {
      const { maxAge } = strapi.config.middleware.settings.public;
      const basename = "/vendor";

      const vendorDir = path.resolve(strapi.dir, "vendor");

      // Serve vendor assets.
      strapi.router.get(
        `${basename}/*`,
        async (ctx, next) => {
          ctx.url = ctx.url.replace(/^\/vendor/, "");
          if (!ctx.url) ctx.url = basename;
          await next();
        },
        koaStatic(vendorDir, {
          index: "index.html",
          maxage: maxAge,
          defer: false
        })
      );

      // server vendor assets and all routers
      strapi.router.get(`${basename}*`, ctx => {
        ctx.type = "html";
        ctx.body = fs.createReadStream(
          path.join(`${vendorDir}/index.html`)
        );
      });
    }
  };
};
const fs = require('fs');
const path = require('path');

if (process.env.VITE_HOT_RELOAD === '1') {
  const { createServer: createViteServer } = require('vite');

  const vite = createViteServer({
    root: __dirname,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  module.exports = [
    async (req, res, next) => {
      try {
        (await vite).middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    async (req, res, next) => {
      try {
        // 1. Read index.html
        const template = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8');

        // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
        //    and also applies HTML transforms from Vite plugins, e.g. global
        //    preambles from @vitejs/plugin-react
        const html = await (await vite).transformIndexHtml(req.url, template);

        // 3. Send the rendered HTML back.
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (err) {
        // If an error is caught, let Vite fix the stack trace so it maps back
        // to your actual source code.
        (await vite).ssrFixStacktrace(err);
        next(err);
      }
    },
  ];
} else {
  const serveStatic = require('serve-static');

  // 1. Read index.html
  const template = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8');

  module.exports = [
    serveStatic(path.resolve(__dirname, './dist'), {
      dotfiles: 'ignore',
      etag: true,
      fallthrough: true,
      index: false,
      redirect: false,
    }),

    // 2. Send the rendered HTML back.
    (_req, res) => res.status(200).set({ 'Content-Type': 'text/html' }).send(template),
  ];
}

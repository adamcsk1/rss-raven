module.exports = (app) =>
  app.use((req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization !== `Basic ${process.env.TOKEN}`) res.status(403).send('Forbidden');
    else next();
  });

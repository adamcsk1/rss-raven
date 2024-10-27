const { request } = require('../utils/request.util');
const { API_PREFIX, ENDPOINTS } = require('../constants/apis.constant');

module.exports = (app) =>
  app.get(`${API_PREFIX}${ENDPOINTS.GET.FETCH_FEED}`, async (req, res) => {
    try {
      const url = req.query.url;

      if (!url || (!url.startsWith('https://') && !url.startsWith('http://'))) res.status(400).send('Bad request');
      else {
        const responseBody = await request(url);

        if (/<rss(\"[^\"]*\"|'[^']*'|[^'\">])*>/g.exec(responseBody) === null && /<feed(\"[^\"]*\"|'[^']*'|[^'\">])*>/g.exec(responseBody) === null) res.status(400).send('Bad request');
        else res.send(responseBody);
      }
    } catch (error) {
      res.status(500).send('Feed process error');
    }
  });

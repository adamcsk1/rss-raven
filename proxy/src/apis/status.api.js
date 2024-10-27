const { request } = require("../utils/request.util");
const { API_PREFIX, ENDPOINTS } = require("../constants/apis.constant");

module.exports = (app) =>
  app.get(`${API_PREFIX}${ENDPOINTS.GET.STATUS}`, (req, res) => res.send("OK"));

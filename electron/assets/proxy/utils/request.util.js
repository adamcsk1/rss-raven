const http = require('http');
const https = require('https');

const protocol = (url = '') => (url.startsWith('http') === 'http' ? http : https);

const request = (url = '') =>
  new Promise((resolve, reject) =>
    protocol(url)
      .get(
        url,
        {
          headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36',
          },
        },
        (incomingMessage) => {
          let chunks = '';

          incomingMessage.on('error', () => reject());
          incomingMessage.on('data', (chunk) => (chunks += chunk.toString()));
          incomingMessage.on('end', () => resolve(chunks));
        },
      )
      .on('error', () => reject()),
  );

module.exports = { request };

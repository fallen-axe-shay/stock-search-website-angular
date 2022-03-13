'use strict';

const express = require('express');
const cors = require('cors')
const axios = require('axios')

const _GLOBAL = {
  FH_API_KEY: 'c8arq2aad3ifo5nsb640'
}

const app = express();

app.use(cors());

app.get('/getAutocompleteData/:ticker', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    q: req.params.ticker
  }
  axios.get('https://finnhub.io/api/v1/search', {params: data})
  .then(fhRes => {
    res.status(fhRes.status).json(fhRes.data);
  })
  .catch(error => {
    res.status(500).json({message: error});
  })
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;

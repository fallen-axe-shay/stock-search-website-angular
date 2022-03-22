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

app.get('/getCompanyProfile/:ticker', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    symbol: req.params.ticker
  }
  axios.get('https://finnhub.io/api/v1/stock/profile2', {params: data})
  .then(fhRes => {
    res.status(fhRes.status).json(fhRes.data);
  })
  .catch(error => {
    res.status(500).json({message: error});
  })
});

app.get('/getCompanyQuote/:ticker', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    symbol: req.params.ticker
  }
  axios.get('https://finnhub.io/api/v1/quote', {params: data})
  .then(fhRes => {
    res.status(fhRes.status).json(fhRes.data);
  })
  .catch(error => {
    res.status(500).json({message: error});
  })
});

app.get('/getCompanyPeers/:ticker', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    symbol: req.params.ticker
  }
  axios.get('https://finnhub.io/api/v1/stock/peers', {params: data})
  .then(fhRes => {
    res.status(fhRes.status).json(fhRes.data);
  })
  .catch(error => {
    res.status(500).json({message: error});
  })
});

app.get('/getCompanyHistoricalData/:ticker/:time', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    symbol: req.params.ticker,
    resolution: 5,
    from: parseInt(req.params.time) - (6*60*60),
    to: req.params.time
  }
  console.log(data)
  axios.get('https://finnhub.io/api/v1/stock/candle', {params: data})
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

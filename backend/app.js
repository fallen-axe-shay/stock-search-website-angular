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
  axios.get('https://finnhub.io/api/v1/stock/candle', {params: data})
  .then(fhRes => {
    res.status(fhRes.status).json(fhRes.data);
  })
  .catch(error => {
    res.status(500).json({message: error});
  })
});

app.get('/getCompanyHistoricalDataTwoYears/:ticker/:time', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    symbol: req.params.ticker,
    resolution: 'D',
    from: parseInt(req.params.time) - (2*365*24*60*60),
    to: req.params.time
  }
  axios.get('https://finnhub.io/api/v1/stock/candle', {params: data})
  .then(fhRes => {
    res.status(fhRes.status).json(fhRes.data);
  })
  .catch(error => {
    res.status(500).json({message: error});
  })
});

app.get('/getCompanySocialSentiment/:ticker', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    symbol: req.params.ticker,
    from: '2022-01-01'
  }
  axios.get('https://finnhub.io/api/v1/stock/social-sentiment', {params: data})
  .then(fhRes => {
    res.status(fhRes.status).json(fhRes.data);
  })
  .catch(error => {
    res.status(500).json({message: error});
  })
});

app.get('/getCompanyNews/:ticker', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    symbol: req.params.ticker,
    from: getFormattedYear((new Date()).getTime() - 30*24*60*60*1000),
    to: getFormattedYear((new Date()).getTime())
  }
  axios.get('https://finnhub.io/api/v1/company-news', {params: data})
  .then(fhRes => {
    res.status(fhRes.status).json(fhRes.data);
  })
  .catch(error => {
    res.status(500).json({message: error});
  })
});

app.get('/getCompanyEarnings/:ticker', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    symbol: req.params.ticker
  }
  axios.get('https://finnhub.io/api/v1/stock/earnings', {params: data})
  .then(fhRes => {
    res.status(fhRes.status).json(fhRes.data);
  })
  .catch(error => {
    res.status(500).json({message: error});
  })
});

app.get('/getCompanyRecommendationTrends/:ticker', (req, res) => {
  let data = {
    token: _GLOBAL.FH_API_KEY,
    symbol: req.params.ticker
  }
  axios.get('https://finnhub.io/api/v1/stock/recommendation', {params: data})
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


function getFormattedYear(time) {
  let today = new Date(time);
  var date = today.getFullYear()+'-' + zeroPad(today.getMonth()+1, 2)+'-' + zeroPad(today.getDate(), 2);
  return date;
}

function zeroPad(num, places) {
  return String(num).padStart(places, '0');
}
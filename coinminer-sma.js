const axios = require('axios');
const colors = require('colors');
const SMA = require('technicalindicators').SMA
const technicalIndicators = require('technicalindicators');

var p1 = parseInt(process.argv[2]) | 9;
var p2 = parseInt(process.argv[3]) | 26;
var p3 = 99;

var gain = 0;
var buy = 0;
var sell = 0;
var signal = false;

technicalIndicators.setConfig('precision', 11);

var symbol = 'BTCUSDT';
var interval = '1m';
var limit = 100;

function coinminer() {
  axios.get('https://api.binance.com/api/v1/klines?symbol=' + symbol + '&interval=' + interval + '&limit=' + limit)
    .then(function (response) {

    var date = new Date(response.data[limit-2][0]).toLocaleString();
    var open = +response.data[limit-2][1];
    var close = +response.data[limit-2][4];
    var volume = Number.parseFloat(+response.data[limit-2][5]).toFixed(4);

    var values = new Array();
    for(let i = 0 ; i < limit ; i++ ) {
      values.push(+response.data[i][4]);
    }

    var sma1 = new SMA({period : p1, values : values});
    var m1 = sma1.getResult()[sma1.getResult().length-2];

    var sma2 = new SMA({period : p2, values : values});
    var m2 = sma2.getResult()[sma2.getResult().length-2];

    var sma3 = new SMA({period : p3, values : values});
    var m3 = sma3.getResult()[sma3.getResult().length-2];

    if(m1 > m2) {
      if(signal == false) {
        buy = open;
        sell = 0;
        signal = true;
      }
    } else {
      if(signal == true) {            
        sell = open;
        gain += (sell - buy);
        buy = 0;
        signal = false;
      }
    }

    console.log(
      date,
      m1.toString().green,
      ((m1 < m2) ? m2.toString().red : m2.toString().green),
      ((m1 < m3) ? m3.toString().red : m3.toString().green),
      ((close-open < 0) ? volume.red : volume.green),
      buy,
      sell,
      ((gain < 0) ? gain.toString().red : gain.toString().green)
    );

  })
  .catch(function (error) {
    console.log(error);
  });
}

setInterval(coinminer, 60000);
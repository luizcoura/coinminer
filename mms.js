const axios = require('axios');
var colors = require('colors/safe');

var gain = 0;
var buy = 0;
var sell = 0;
var signal = false;

var p1 = 9
var p2 = 26
var p3 = 99

var symbol = 'BTCUSDT'
var interval = '1m'
var limit = 100

var mmsp1 = new Array(limit-1);
var mmsp2 = new Array(limit-1);
var mmsp3 = new Array(limit-1);

function coinminer() {
  axios.get('https://api.binance.com/api/v1/klines?symbol=' + symbol + '&interval=' + interval + '&limit=' + limit)
    .then(function (response) {

    console.log("");

    mmsp1.shift();
    var sum = 0;
	  for(let i = limit - 2 ; i > (limit - 2) - p1 ; i-- ) {
	  	sum += +response.data[i][4];
	  }
	  mmsp1.push(sum/p1);

    mmsp2.shift();
    var sum = 0;
	  for(let i = limit - 2 ; i > (limit - 2) - p2 ; i-- ) {
	  	sum += +response.data[i][4];
	  }
	  mmsp2.push(sum/p2);

    mmsp3.shift();
    var sum = 0;
	  for(let i = limit - 2 ; i > (limit - 2) - p3 ; i-- ) {
	  	sum += +response.data[i][4];
	  }
	  mmsp3.push(sum/p3);

    for (let i = 0; i < limit - 1; i++) {
      var a = Number.parseFloat(mmsp1[i]).toFixed(6);
      var b = Number.parseFloat(mmsp2[i]).toFixed(6);
      var c = Number.parseFloat(mmsp3[i]).toFixed(6);

      var d = new Date(response.data[i][0]).toLocaleString();
      var v = Number.parseFloat(+response.data[i][5]).toFixed(4);
      var qv = Number.parseFloat(+response.data[i][7]).toFixed(4);
      var t = response.data[i][8];
      var bbav = Number.parseFloat(+response.data[i][9]).toFixed(4);
      var bqav = Number.parseFloat(+response.data[i][10]).toFixed(4);

      if(isNaN(a) || isNaN(b) || isNaN(c)) {
        continue;
      }

      if((a > b) && (a < c)) {
          if(signal == false) {
            console.log(
              colors.green("a>b && a<c"),
              colors.green("buy = "),
              colors.green(+response.data[i][1])
            );

            buy = +response.data[i][1];
            sell = 0;
            signal = true;
          }

          console.log(
          d, 
          colors.green(a), 
          colors.green(b),
          colors.red(c),
          v,
          qv,
          t,
          bbav,
          bqav,
          Number.parseFloat(gain).toFixed(4)
          );
        } else if((a < b) && (a > c)) {
          if(signal == true) {            
            console.log(
              colors.red("a<b && a>c"),
              colors.red("sell = "),
              colors.red(+response.data[i][1])
            );

            sell = +response.data[i][1];
            gain += (sell - buy);
            buy = 0;
            signal = false;
          }

          console.log(
          d, 
          colors.green(a), 
          colors.red(b),
          colors.green(c),
          v,
          qv,
          t,
          bbav,
          bqav,
          Number.parseFloat(gain).toFixed(4)
          );
        } else if((a > b) && (a > c)) {
          if(signal == false) {
            console.log(
              colors.green("a>b && a>c"),
              colors.green("buy = "),
              colors.green(+response.data[i][1])
            );

            buy = +response.data[i][1];
            sell = 0;
            signal = true;
          }

          console.log(
          d, 
          colors.green(a), 
          colors.green(b),
          colors.green(c),
          v,
          qv,
          t,
          bbav,
          bqav,
          Number.parseFloat(gain).toFixed(4)
          );
        } else {
          if(signal == true) {
            console.log(
              colors.red("a<b && a>c"),
              colors.red("sell = "),
              colors.red(+response.data[i][1])
            );

            sell = +response.data[i][1];
            gain += (sell - buy);
            buy = 0;
            signal = false;
          }

          console.log(
          d, 
          colors.red(a), 
          colors.red(b),
          colors.red(c),
          v,
          qv,
          t,
          bbav,
          bqav,
          Number.parseFloat(gain).toFixed(4)
          );
        }
      }
  })
  .catch(function (error) {
    console.log(error);
  });
}

setInterval(coinminer, 60000);
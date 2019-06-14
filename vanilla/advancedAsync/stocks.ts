declare var Chart;

import { merge, fromEvent, of, combineLatest } from 'rxjs';
import { scan, map, pluck, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

let config = {
  type: 'line',
  data: {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    datasets: []
  },
  options: {
    legend: {
      onClick: () => { }
    },
    animation: false,
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value'
        }
      }]
    }
  }
};

let colorMap = {
  ABC: 'rgb(255, 99, 132)',
  DEF: 'rgb(75, 192, 192)',
  GHI: 'rgb(54, 162, 235)',
  JKL: 'rgb(153, 102, 255)'
};

let ctx = document.querySelector('canvas').getContext('2d');
let stockChart = new Chart(ctx, config);

let abcEl = <HTMLElement>document.querySelector('.abc');
let defEl = <HTMLElement>document.querySelector('.def');
let ghiEl = <HTMLElement>document.querySelector('.ghi');
let jklEl = <HTMLElement>document.querySelector('.jkl');

function makeCheckboxStream(el, ticker) {
  return merge(
    fromEvent(el, 'change'),
    of({ target: { checked: true } })
  ).pipe(
    pluck('target', 'checked'),
    map(isEnabled => ({
      isEnabled,
      stock: ticker
    }))
  )
}

function separateDataByStocks(dataSet) {
  let tempRes = dataSet.reduce((prev, datum) => {
    datum.forEach(d => {
      if (!prev[d.label]) {
        prev[d.label] = []
      }
      prev[d.label].push(d.price);
    })
    return prev;
  }, {})

  return Object.keys(tempRes).map(key => {
    // convert into something chart.js can read​
    return {
      label: key,
      data: tempRes[key],
      fill: false,
      backgroundColor: colorMap[key],
      borderColor: colorMap[key]
    }
  });

}

let endpoint = 'ws://localhost:3000/api/advancedAsync/stock-ws';
let stockStream$ = webSocket(endpoint)
  .pipe(
    scan((acc, next) => {
      acc.push(next);
      if (acc.length > 10) {
        acc.shift()
      }
      return acc;
    }, []),
    map(separateDataByStocks)
  );

let settings$ = combineLatest(
  makeCheckboxStream(abcEl, 'abc'),
  makeCheckboxStream(defEl, 'def'),
  makeCheckboxStream(ghiEl, 'ghi'),
  makeCheckboxStream(jklEl, 'jkl'),
  (...filterRes) => {
    return filterRes
      .filter(f => f.isEnabled)
      .map(f => f.stock)
  }
);

combineLatest(
  settings$,
  stockStream$,
  (enabledStocks, stockUpdates) => ({ enabledStocks, stockUpdates })
).pipe(
  map(({ enabledStocks, stockUpdates }) => {
    console.log(enabledStocks, stockUpdates)
    return stockUpdates.filter(stockHistory => enabledStocks.includes(stockHistory.label.toLowerCase()));
  }),
).subscribe(newDataSet => {
  config.data.datasets = newDataSet;
  stockChart.update();
}, err => console.error(err));
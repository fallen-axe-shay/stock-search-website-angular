declare const require: any;
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { StateService } from 'src/services/state-service.service';
import HC_stock from 'highcharts/modules/stock';
HC_stock(Highcharts);
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
// const vbp = require('highcharts/indicators/volume-by-price');
// vbp(Highcharts);

@Component({
  selector: 'app-search-charts',
  templateUrl: './search-charts.component.html',
  styleUrls: ['./search-charts.component.css']
})
export class SearchChartsComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  updateFlag = false;

  ohlc: any;
  volume: any;
  groupingUnits: any;

  constructor(public state: StateService, private httpClient: HttpClient) { 
    this.groupingUnits = [['week', [1]], ['month', [1, 2, 3, 4, 6]]];
    this.chartOptions = {
      rangeSelector: {
        selected: 2
      },
      title: {
        text: `${this.state.getStockData().ticker} Historical`
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],
      tooltip: {
        split: true
      },
      plotOptions: {
        series: {
          dataGrouping: {
            units: this.groupingUnits
          }
        }
      },
      series: [
        {
          type: 'candlestick',
          name: this.state.getStockData()['ticker'],
          zIndex: 2,
          data: this.ohlc,
          id: this.state.getStockData()['ticker']
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: this.volume,
          yAxis: 1
        },
        {
          type: 'vbp',
          linkedTo: this.state.getStockData()['ticker'],
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        },
        {
          type: 'sma',
          linkedTo: this.state.getStockData()['ticker'],
          zIndex: 1,
          marker: {
            enabled: false
          }
        }
      ]
    };
  }


  ngOnInit(): void {
    let ticker = this.state.getStockData()['ticker'];
    this.showHistoryData(ticker);
  }

  dateWithTimeZone(date) {  
    let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
    let tzDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    let offset = utcDate.getTime() - tzDate.getTime();
    date.setTime( date.getTime() - offset );
    return date.getTime();
  };

  showHistoryData(ticker) {
    let url = `${'/api/getCompanyHistoricalData'}/${ticker}/${Math.floor(this.state.getSearchPageFlags()['isMarketOpen'] ? (new Date()).getTime()/1000 : (new Date(this.state.getStockData()['t_unix']*1000)).getTime()/1000)}`;
    this.httpClient.get(url).subscribe((res)=>{
        res = {
          historicalData: res
        }
        this.state.addStockData(res);
        this.displayHighCharts();
    });
  }

  displayHighCharts() {



    this.ohlc = [];
    this.volume = [];

    for (var i = 0; i < this.state.getStockData()['historicalData']['v'].length; i++) {
      this.ohlc.push([
        this.dateWithTimeZone(new Date(this.state.getStockData()['historicalData']['t'][i]*1000)), // the date
        this.state.getStockData()['historicalData']['o'][i], // open
        this.state.getStockData()['historicalData']['h'][i], // high
        this.state.getStockData()['historicalData']['l'][i], // low
        this.state.getStockData()['historicalData']['c'][i] // close
      ]);

      this.volume.push([
        this.dateWithTimeZone(new Date(this.state.getStockData()['historicalData']['t'][i]*1000)), // the date
        this.state.getStockData()['historicalData']['v'][i] // the volume
      ]);
    }

    // this.chartOptions = {
    //   rangeSelector: {
    //     selected: 2
    //   },
    //   title: {
    //     text: `${this.state.getStockData().ticker} Historical`
    //   },
    //   subtitle: {
    //     text: 'With SMA and Volume by Price technical indicators'
    //   },
    //   yAxis: [{
    //     startOnTick: false,
    //     endOnTick: false,
    //     labels: {
    //       align: 'right',
    //       x: -3
    //     },
    //     title: {
    //       text: 'OHLC'
    //     },
    //     height: '60%',
    //     lineWidth: 2,
    //     resize: {
    //       enabled: true
    //     }
    //   }, {
    //     labels: {
    //       align: 'right',
    //       x: -3
    //     },
    //     title: {
    //       text: 'Volume'
    //     },
    //     top: '65%',
    //     height: '35%',
    //     offset: 0,
    //     lineWidth: 2
    //   }],
    //   tooltip: {
    //     split: true
    //   },
    //   plotOptions: {
    //     series: {
    //       dataGrouping: {
    //         units: this.groupingUnits
    //       }
    //     }
    //   },
    //   series: [{
    //     type: 'candlestick',
    //     name: this.state.getStockData()['ticker'],
    //     zIndex: 2,
    //     data: this.ohlc,
    //     id: this.state.getStockData()['ticker']
    //   },{
    //     type: 'column',
    //     name: 'Volume',
    //     id: 'volume',
    //     data: this.volume,
    //     yAxis: 1
    //   },
    //   {
    //     type: 'vbp',
    //     linkedTo: this.state.getStockData()['ticker'],
    //     params: {
    //       volumeSeriesID: 'volume'
    //     },
    //     dataLabels: {
    //       enabled: false
    //     },
    //     zoneLines: {
    //       enabled: false
    //     }
    //   },
    //   {
    //     type: 'sma',
    //     linkedTo: this.state.getStockData()['ticker'],
    //     zIndex: 1,
    //     marker: {
    //       enabled: false
    //     }
    //   }
    // ]
    // };

    this.chartOptions.series[0] = {
      type: 'candlestick',
      name: this.state.getStockData()['ticker'],
      zIndex: 2,
      data: this.ohlc,
      id: this.state.getStockData()['ticker']
    };
    this.chartOptions.series[1] = {
      type: 'column',
      name: 'Volume',
      id: 'volume',
      data: this.volume,
      yAxis: 1
    };
    this.chartOptions.series[2] = {
      type: 'vbp',
      linkedTo: this.state.getStockData()['ticker'],
      params: {
        volumeSeriesID: 'volume'
      },
      dataLabels: {
        enabled: false
      },
      zoneLines: {
        enabled: false
      }
    };
    this.chartOptions.series[3] = {
      type: 'sma',
      linkedTo: this.state.getStockData()['ticker'],
      zIndex: 1,
      marker: {
        enabled: false
      }
    };
    this.updateFlag = true;
  }

}

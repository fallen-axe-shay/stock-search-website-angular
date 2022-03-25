declare const require: any;
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { StateService } from 'src/services/state-service.service';
import HC_stock from 'highcharts/modules/stock';
HC_stock(Highcharts);
const indicators = require('highcharts/indicators/indicators');
const vbp = require('highcharts/indicators/volume-by-price');
const drag = require('highcharts/modules/drag-panes');
drag(Highcharts);
indicators(Highcharts);
vbp(Highcharts); 

@Component({
  selector: 'app-search-charts',
  templateUrl: './search-charts.component.html',
  styleUrls: ['./search-charts.component.css']
})
export class SearchChartsComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  updateFlag = false;
  chart: any;

  ohlc: any;
  volume: any;
  groupingUnits: any;

  constructor(public state: StateService, private httpClient: HttpClient) { 
    this.ohlc = [];
    this.volume = [];
    this.groupingUnits = [['week', [1]], ['month', [1, 2, 3, 4, 6]]];
  }


  ngOnInit(): void {
    let ticker = this.state.getStockData()['ticker'];
  }

  dateWithTimeZone(date) {  
    let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
    let tzDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    let offset = utcDate.getTime() - tzDate.getTime();
    date.setTime( date.getTime() - offset );
    return date.getTime();
  };

  showHistoryData(ticker) {

    if(ticker==undefined) return;

    let url = `${'/api/getCompanyHistoricalDataTwoYears'}/${ticker}/${Math.floor(this.state.getSearchPageFlags()['isMarketOpen'] ? (new Date()).getTime()/1000 : (new Date(this.state.getStockData()['t_unix']*1000)).getTime()/1000)}`;
    this.httpClient.get(url).subscribe((res)=>{
        res = {
          historicalDataChartsTab: res
        }
        this.state.addStockData(res);
        this.displayHighCharts();
    });
  }

  displayHighCharts() {

    this.ohlc = [];
    this.volume = [];

    for (var i = 0; i < this.state.getStockData()['historicalDataChartsTab']['v'].length; i++) {
      this.ohlc.push([
        this.dateWithTimeZone(new Date(this.state.getStockData()['historicalDataChartsTab']['t'][i]*1000)), // the date
        this.state.getStockData()['historicalDataChartsTab']['o'][i], // open
        this.state.getStockData()['historicalDataChartsTab']['h'][i], // high
        this.state.getStockData()['historicalDataChartsTab']['l'][i], // low
        this.state.getStockData()['historicalDataChartsTab']['c'][i] // close
      ]);

      this.volume.push([
        this.dateWithTimeZone(new Date(this.state.getStockData()['historicalDataChartsTab']['t'][i]*1000)), // the date
        this.state.getStockData()['historicalDataChartsTab']['v'][i] // the volume
      ]);
    }

    this.Highcharts.setOptions({
      lang: {
        // Pre-v9 legacy settings
        rangeSelectorFrom: 'From',
        rangeSelectorTo: 'To'
      }
    });

    this.chartOptions = {
      rangeSelector: {
        enabled: true,
        inputBoxBorderColor: 'gray',
        inputBoxWidth: 120,
        inputBoxHeight: 18,
        inputStyle: {
            color: 'black',
            fontWeight: 'bold'
        },
        labelStyle: {
            color: 'silver',
            fontWeight: 'bold'
        },
      selected: 2
      },
      title: {
        text: `${this.state.getStockData().ticker} Historical`
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      navigator: {
        enabled: true
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
        opposite: true,
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        },
      },
      {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'VBP'
        },
        opposite: false,
        height: '60%',
        lineWidth: 2,
        visible: false
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        opposite: true,
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2,
      }],
      xAxis: {
        type: "datetime"
      },
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
      series: [{
        type: 'candlestick',
        name: this.state.getStockData()['ticker'],
        zIndex: 2,
        data: this.ohlc,
        id: this.state.getStockData()['ticker'],
        showInLegend: false
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: this.volume,
        showInLegend: false,
        yAxis: 2
      }, {
        type: 'vbp',
        linkedTo: 'volume',
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        },
        name: 'VBP',
        showInLegend: false,
        yAxis: 1
      }, {
        type: 'sma',
        linkedTo: this.state.getStockData()['ticker'],
        zIndex: 1,
        marker: {
          enabled: false
        }
      }
    ]
    };

    this.state.setHighChartsData({
      highchart: Highcharts,
      options: this.chartOptions,
      update: true
    });
    
  }

}

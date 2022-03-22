import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StateService } from 'src/services/state-service.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-search-summary',
  templateUrl: './search-summary.component.html',
  styleUrls: ['./search-summary.component.css']
})
export class SearchSummaryComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  updateFlag = false;

  constructor(public state: StateService, private httpClient: HttpClient) { 
    this.chartOptions = {
      title: {
        text: `${this.state.getStockData()['ticker']} Hourly Price Variation`,
        style: {
          color: '#686868'
        }
      },
      tooltip: {
        split: true
      },
      xAxis: [{
        title: {
          text: null
        },
        type: 'datetime'
      }],
      yAxis: [{
        title: {
          text: null
        }
      }],
      series: [{
        type: 'line',
        name: this.state.getStockData()['ticker'],
        data: this.state.getStockData()['historicalData'] && this.getHistoricalData(),
        showInLegend: false,
        color: this.state.getStockData()['historicalData'] ? this.state.getSearchPageFlags()['isProfit'] ? '#229e38' : '#c50000' : null
      }]
    };
  }

  @Output("searchTicker") searchTicker: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    let ticker = this.state.getStockData()['ticker'];
    this.showSummaryData(ticker);
  }

  showSummaryData(ticker) {
    let url = `${'/api/getCompanyHistoricalData'}/${ticker}/${Math.floor(this.state.getSearchPageFlags()['isMarketOpen'] ? (new Date()).getTime()/1000 : (new Date(this.state.getStockData()['t_unix']*1000)).getTime()/1000)}`;
    this.httpClient.get(url).subscribe((res)=>{
        res = {
          historicalData: res
        }
        this.state.addStockData(res);
        this.displayHighCharts();
    });
  }

  onPeerClick(ticker) {
    this.searchTicker.emit([ticker, true]);
  }

  getHistoricalData() {
    let chartData = [];
    for(var i = 0; i<this.state.getStockData()['historicalData']['c'].length; i++) {
      chartData.push([this.dateWithTimeZone(new Date(this.state.getStockData()['historicalData']['t'][i]*1000)), this.state.getStockData()['historicalData']['c'][i]]);
    }
    return chartData;
  }

  displayHighCharts() {
    this.chartOptions.series[0] = {
      type: 'line',
      data: this.getHistoricalData(),
      color: this.state.getSearchPageFlags()['isProfit'] ? '#229e38' : '#c50000'
    }
    this.updateFlag = true;
  }

  dateWithTimeZone(date) {  
    let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
    let tzDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    let offset = utcDate.getTime() - tzDate.getTime();
    date.setTime( date.getTime() - offset );
    
    return date.getTime();
  };

}

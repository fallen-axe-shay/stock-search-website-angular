import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { StateService } from 'src/services/state-service.service';

@Component({
  selector: 'app-search-insights',
  templateUrl: './search-insights.component.html',
  styleUrls: ['./search-insights.component.css']
})
export class SearchInsightsComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  HighchartsEPS: typeof Highcharts = Highcharts;
  HighchartsRecommendation: typeof Highcharts = Highcharts;
  chartOptionsEPS: Highcharts.Options;
  chartOptionsRecommendation: Highcharts.Options;

  constructor(public state: StateService, private httpClient: HttpClient) { 

  }

  ngOnInit(): void {    
  }

  getInsightsData(ticker) {
    let url = `${'/api/getCompanySocialSentiment'}/${ticker}`;
    this.httpClient.get(url).subscribe((res)=>{
        res = {
          socialSentiment: res
        }
        this.state.addStockData(res);
        this.displaySentimentData();
    });
    url = `${'/api/getCompanyEarnings'}/${ticker}`;
    this.httpClient.get(url).subscribe((res)=>{
        res = {
          companyEarnings: res
        }
        this.state.addStockData(res);
        this.displayEarningsData();
    });
    url = `${'/api/getCompanyRecommendationTrends'}/${ticker}`;
    this.httpClient.get(url).subscribe((res)=>{
        res = {
          companyRecommendations: res
        }
        this.state.addStockData(res);
        this.displayRecommendationData();
    });
  }

  displayEarningsData() {

    let earningsData = this.state.getStockData().companyEarnings;

    let actualData = earningsData.map((item) => item['actual']==null ? 0 : item['actual']);

    let estimateData = earningsData.map((item) => item['estimate']==null ? 0 : item['estimate']);

    let categories = earningsData.map((item) => `${item['period']}<br>Surprise: ${item['surprise']==null ? 0 : item['surprise']}`);

    this.chartOptionsEPS = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Historical EPS Surprises'
      },
      xAxis: {
        maxPadding: 0.05,
        showLastLabel: true,
        categories: categories
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS'
        },
        lineWidth: 2
      },
      legend: {
        enabled: true
      },
      tooltip: {
        split: false,
        shared: true
      },
      series: [{
        type: 'spline',
        name: 'Actual',
        data: actualData,
        showInLegend: true
      },{
        type: 'spline',
        name: 'Estimate',
        data: estimateData,
        showInLegend: true
      }]
    };

    this.state.setHistoricalEPSChartsData(
      {
        highchart: this.HighchartsEPS,
        options: this.chartOptionsEPS,
        update: true
      }
    );

  }

  displayRecommendationData() {
    
    let recommendationData = this.state.getStockData().companyRecommendations;

    let categories = recommendationData.map((item) => item['period'].substring(0, item['period'].length-3));

    let data = [recommendationData.map((item) => item['strongBuy']), recommendationData.map((item) => item['buy']), recommendationData.map((item) => item['hold']), recommendationData.map((item) => item['sell']), recommendationData.map((item) => item['strongSell'])];

    this.chartOptionsRecommendation = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Recommendation Trends'
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis',
          align: 'high'
        },
        stackLabels: {
          enabled: false,
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || 'white',
        shadow: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        type: 'column',
        name: 'Strong Buy',
        color: '#176f37',
        data: data[0]
      }, {
        type: 'column',
        name: 'Buy',
        color: '#1db954',
        data: data[1]
      }, {
        type: 'column',
        name: 'Hold',
        color: '#b98b1d',
        data: data[2]
      }, {
        type: 'column',
        name: 'Sell',
        color: '#f45e5e',
        data: data[3]
      },
      {
        type: 'column',
        name: 'Strong Sell',
        color: '#813131',
        data: data[4]
      }]
    };

    this.state.setRecommendationChartsData(
      {
        highchart: this.HighchartsRecommendation,
        options: this.chartOptionsRecommendation,
        update: true
      }
    );

  }

  displaySentimentData() {
    let redditMentions = this.state.getStockData().socialSentiment['reddit'];
    let twitterMentions = this.state.getStockData().socialSentiment['twitter'];
    let redditMentionsTotal = 0, redditMentionsPositive = 0, redditMentionsNegative = 0; 
    let twitterMentionsTotal = 0, twitterMentionsPositive = 0, twitterMentionsNegative = 0; 
    for(var item of redditMentions) {
      redditMentionsTotal += item['mention'];
      redditMentionsPositive += item['positiveMention'];
      redditMentionsNegative += item['negativeMention'];
    }
    for(var item of twitterMentions) {
      twitterMentionsTotal += item['mention'];
      twitterMentionsPositive += item['positiveMention'];
      twitterMentionsNegative += item['negativeMention'];
    }
    this.state.addStockData({redditMentionsPositive: redditMentionsPositive, 
      redditMentionsTotal: redditMentionsTotal, 
      redditMentionsNegative: redditMentionsNegative,
      twitterMentionsTotal: twitterMentionsTotal, 
      twitterMentionsPositive: twitterMentionsPositive, 
      twitterMentionsNegative: twitterMentionsNegative});
  }

}

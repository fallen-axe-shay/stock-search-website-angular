import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/services/state-service.service';

@Component({
  selector: 'app-search-insights',
  templateUrl: './search-insights.component.html',
  styleUrls: ['./search-insights.component.css']
})
export class SearchInsightsComponent implements OnInit {

  constructor(public state: StateService, private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  getSocialSentiment(ticker) {
    let url = `${'/api/getCompanySocialSentiment'}/${ticker}`;
    this.httpClient.get(url).subscribe((res)=>{
        res = {
          socialSentiment: res
        }
        this.state.addStockData(res);
        this.displaySentimentData();
    });
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

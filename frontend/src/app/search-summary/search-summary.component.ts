import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StateService } from 'src/services/state-service.service';

@Component({
  selector: 'app-search-summary',
  templateUrl: './search-summary.component.html',
  styleUrls: ['./search-summary.component.css']
})
export class SearchSummaryComponent implements OnInit {

  constructor(public state: StateService, private httpClient: HttpClient) { }

  @Output("searchTicker") searchTicker: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    let ticker = this.state.getStockData()['ticker'];
    let url = `${'/api/getCompanyHistoricalData'}/${ticker}/${this.state.getSearchPageFlags()['isMarketOpen'] ? (new Date()).getTime()/1000 : (new Date(this.state.getStockData()['t_unix']*1000)).getTime()/1000}`;
    this.httpClient.get(url).subscribe((res)=>{
      res = {
        historicalData: res
      }
        this.state.addStockData(res);
        console.log(this.state.getStockData())
    });
  }

  onPeerClick(ticker) {
    this.searchTicker.emit([ticker, true]);
  }

}

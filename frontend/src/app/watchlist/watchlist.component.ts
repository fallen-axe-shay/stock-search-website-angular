import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/services/state-service.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  requestURLs: any = ['/api/getCompanyProfile', '/api/getCompanyQuote'];

  watchlistTickers: any;
  watchlistData: any;

  constructor(public state: StateService, private httpClient: HttpClient) { 
    this.watchlistTickers = this.state.readFromLocalStorage('watchlist');
    this.watchlistData = {};
  }

  ngOnInit(): void {
    this.watchlistTickers.forEach((ticker)=>{
      this.watchlistData[ticker] = {};
      this.requestURLs.forEach((url)=> {
        url = `${url}/${ticker}`;
        this.httpClient.get(url).subscribe((res)=>{
          this.watchlistData[ticker] = Object.assign(this.watchlistData[ticker], res);
      });
      })
    });
  }

  deleteFromWatchlist(ticker) {
    let list = this.state.readFromLocalStorage('watchlist');
    let index = list.indexOf(ticker);
    list.splice(index, 1);
    this.state.addToLocalStorage('watchlist', list);
    this.watchlistTickers.splice(index, 1);
  }

}

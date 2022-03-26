import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Location} from '@angular/common';
import { tick } from '@angular/core/testing';
import { ThrowStmt } from '@angular/compiler';
import { StateService } from 'src/services/state-service.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { SearchSummaryComponent } from '../search-summary/search-summary.component';
import {NgbModal, ModalDismissReasons, NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import { BuyStockModalComponent } from '../buy-stock-modal/buy-stock-modal.component';
import { SellStockModalComponent } from '../sell-stock-modal/sell-stock-modal.component';
import { SearchChartsComponent } from '../search-charts/search-charts.component';
import { SearchInsightsComponent } from '../search-insights/search-insights.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  searchForm = new FormGroup({
    searchFormControl: new FormControl('')
  });

  suggestions: any;

  noRequests: any;
  currentRequest: any;
  queryResult: any;
  currentTime: any;
  watchlistAlert: any;

  intervalObject: any;
  timeoutObject: any;
  timeoutObjectBuySell: any;

  requestURLs: any = {
    autocomplete: ['AutoComplete', '/api/getAutocompleteData'],
    companyProfile: ['Profile', '/api/getCompanyProfile'],
    companyQuote: ['Stock', '/api/getCompanyQuote'],
    companyPeers: ['Peers', '/api/getCompanyPeers'],
    companyHistoricalData: ['CompanyHistory', '/api/getCompanyHistoricalData'],
    companyNews: ['News', 'api/getCompanyNews']
  }

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private location: Location, public state: StateService) {
    this.suggestions = [];
    this.noRequests = 0;
    this.currentRequest = 0;
    this.queryResult = {};
    this.setCurrentTime();
    this.state.getSearchPageFlags()['resultsReady'] && this.clearSearchInterval();
    this.intervalObject = null;
    this.timeoutObject = null;
    this.timeoutObjectBuySell = null; 
    this.state.getSearchPageFlags()['resultsReady'] && this.setSearchInterval(this.state.getStockData()['ticker']);
    this.watchlistAlert = {msg: "", type: null};
   }

   @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
   @ViewChild(SearchSummaryComponent) searchSummary: SearchSummaryComponent;
   @ViewChild(BuyStockModalComponent) buyStockModal: BuyStockModalComponent;
   @ViewChild(SellStockModalComponent) sellStockModal: SellStockModalComponent;
   @ViewChild(SearchChartsComponent) searchCharts: SearchChartsComponent;
   @ViewChild(SearchInsightsComponent) searchInsights: SearchInsightsComponent;
   @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert;
   @ViewChild('selfClosingAlertBuy', {static: false}) selfClosingAlertBuy: NgbAlert;
   @ViewChild('selfClosingAlertSell', {static: false}) selfClosingAlertSell: NgbAlert;

  ngOnInit(): void {
    let ticker = this.route.snapshot.params.ticker;
    if((this.state.getSearchPageFlags()).currentSearch!='') {
      this.searchForm.get('searchFormControl').setValue((this.state.getSearchPageFlags()).currentSearch);
      this.changeURL((this.state.getSearchPageFlags()).currentSearch);
    } else {
      if(ticker.toLowerCase().trim()!='home') {
        this.searchForm.get('searchFormControl').setValue(ticker);
        this.searchTicker(ticker);
      }
    }
    this.searchForm.get('searchFormControl').valueChanges.subscribe((query)=> {
      query = query.toUpperCase();
      this.noRequests += 1;
      this.state.addSearchPageFlags({isLoading: true});
      this.suggestions =[];
      this.getAutoCompleteDetails(query).then((val) => {
        this.currentRequest += 1;
        if(this.noRequests == this.currentRequest) {
          this.state.addSearchPageFlags({isLoading: false});
          this.suggestions = val;
        }
      }).catch(()=>{
        this.suggestions = []; 
        this.currentRequest += 1;
      });
    });
    setInterval(() => {
      this.setCurrentTime();
    }, 60*1000);

  }

  clearWatchlistAlert() {
    this.state.addSearchPageFlags({showWatchlistAlert: false});
  }

  showBuyAlert($event: any) {
    this.state.addSearchPageFlags({showBuyAlert: true, showSellAlert: false});
    if(this.timeoutObjectBuySell != null) {
      clearTimeout(this.timeoutObjectBuySell);
    }
    this.timeoutObjectBuySell = setTimeout(() => {this.selfClosingAlertBuy.close(); this.timeoutObjectBuySell = null}, 2000);
  }

  showSellAlert($event) {
    this.state.addSearchPageFlags({showSellAlert: true, showBuyAlert: false});
    if(this.timeoutObjectBuySell != null) {
      clearTimeout(this.timeoutObjectBuySell);
    }
    this.timeoutObjectBuySell = setTimeout(() => {this.selfClosingAlertSell.close(); this.timeoutObjectBuySell = null}, 2000);
  }

  openModal(type) {
    this.state.modalContent = {price: this.state.getStockData()['c'], ticker: this.state.getStockData()['ticker']};
    type=='buy' ? this.buyStockModal.open() : this.sellStockModal.open();
  }

  clearBuySellAlert() {
    this.state.addSearchPageFlags({showSellAlert: false, showBuyAlert: false});
  }

  setCurrentTime() {
    let today = new Date();
    var date = today.getFullYear()+'-'+this.zeroPad(today.getMonth()+1, 2)+'-'+this.zeroPad(today.getDate(),2);
    var time = this.zeroPad(today.getHours(),2) + ":" + this.zeroPad(today.getMinutes(),2) + ":" + this.zeroPad(today.getSeconds(),2);
    this.currentTime = date + ' ' + time;
  }

  getAutoCompleteDetails(ticker) {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${this.requestURLs.autocomplete[1]}/${ticker}`).subscribe((res)=>{
        let result = res['result'];
        result = result.filter(item => item['type'].toLowerCase().includes('common stock') && !item['symbol'].includes('.'));
        result = result.slice(0,5);
        resolve([...result]);
      }, (error)=>reject());
    });
  }

  getStockDetails(ticker): void {
    this.makeRequests(ticker).then(result=>{setTimeout(()=>{this.searchCharts.showHistoryData(this.state.getStockData().ticker); this.searchInsights.getInsightsData(this.state.getStockData().ticker);}, 1000)});
  }

  resetURL(): void {
    this.location.replaceState("/search/home");
    this.state.addSearchPageFlags({resultsReady: false, isSearching: false, invalidTicker: false, noStockData: false});
    this.intervalObject && clearInterval(this.intervalObject);
    this.state.addSearchPageFlags({currentSearch: ''});
    this.clearSearchInterval();
  }

  changeURL(ticker): void {
    this.location.replaceState(`/search/${ticker}`);
  }

  changeTabListener($event) {
    switch($event.index) {
      case 2:
        this.state.addSearchPageFlags({isHistoricChartReady: true});
        break;
      case 3:
        this.state.addSearchPageFlags({isHistoricalEPSChartReady: true, isRecommendationChartReady: true});
        break;
      default:
        //Do nothing
    }
  }

  searchTicker($event: any) {
    let ticker = Array.isArray($event) ? $event[0].toUpperCase() : $event.toUpperCase();
    this.state.addSearchPageFlags({invalidTicker: false, noStockData: false});
    this.clearSearchInterval();
    this.intervalObject = null;
    this.queryResult = {};
    this.state.addSearchPageFlags(
        {
          resultsReady: false, 
          isSearching: true,
          logoError: false,
          currentSearch: ticker,
          isHistoricChartReady: false,
          isHistoricalEPSChartReady: false,
          isRecommendationChartReady: false
        }
      );
    this.state.setStockData({});
    !Array.isArray($event) && this.changeURL(ticker);
    if(ticker.trim()=='') {
      this.state.addSearchPageFlags({isSearching: false, invalidTicker: true});
      return;
    }
    this.getStockDetails(ticker);
  }

  clearSearchInterval() {
    this.intervalObject && clearInterval(this.intervalObject);
  }

  makeRequests(ticker, refresh = false) {
    let error = false;
    return new Promise((resolve, reject) => {
      let resCount = 0;
      let requests = [this.requestURLs.companyProfile, this.requestURLs.companyQuote, this.requestURLs.companyPeers, this.requestURLs.companyNews];
      requests.forEach((item)=> {
        if(error) {
          console.log(error)
          return false;
        }
        let url;
        switch(item[0]) {
          default:
            url = `${item[1]}/${ticker}`
        }
        this.httpClient.get(url).subscribe((res)=>{
          resCount++;
          switch(item[0]) {
            case 'Peers':
              res = {
                peers: res
              }
              break;
            case 'News':
              res = {
                news: res
              }
              break;
            default:
              //Do nothing
          }
          if(Object.keys(res).length==0) {
            this.showError();
            error = true;
            return;
          }
          this.queryResult = Object.assign({...res}, {...this.queryResult});
          if(resCount==requests.length) {
            let datetime = new Date(this.queryResult['t']*1000);
            this.queryResult['t_unix'] = this.queryResult['t'];
            this.state.addSearchPageFlags({isMarketOpen: ((((new Date()).getTime())/1000 - datetime.getTime()/1000)<(5*60))});
            var date = datetime.getFullYear()+'-'+this.zeroPad(datetime.getMonth()+1, 2)+'-'+this.zeroPad(datetime.getDate(),2);
            var time = this.zeroPad(datetime.getHours(),2) + ":" + this.zeroPad(datetime.getMinutes(),2) + ":" + this.zeroPad(datetime.getSeconds(),2);
            this.queryResult['t'] = date + ' ' + time;
            this.state.addStockData(this.queryResult);
            !refresh && this.state.addSearchPageFlags({resultsReady: !error, isSearching: false});
            !refresh && this.setSearchInterval(ticker);
            resolve(true);
          }
        }, (error)=>{ this.showError(); reject(false) });
      });
    });
  }

  setSearchInterval(ticker) {
    this.intervalObject = setInterval(()=>this.updateStockData(ticker), 15*1000);
  }

  updateStockData(ticker) {
    this.queryResult = {};
    this.setCurrentTime();
    this.makeRequests(ticker, true).then((result)=> {
      this.searchSummary.showSummaryData(ticker);
      this.state.modalContent = {price: this.state.getStockData()['c']};
    });

  }

  showError(): void {
    this.state.addSearchPageFlags({isSearching: false, noStockData: true, resultsReady: false});
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0');
  }

  addRemoveWatchlist() {
    let watchlist, ticker;
    ticker = this.state.getStockData().ticker;
    if(this.state.readFromLocalStorage('watchlist')==undefined || this.state.readFromLocalStorage('watchlist').indexOf(this.state.getStockData()['ticker'])==-1) {
      this.watchlistAlert.msg = `${ticker} added to Watchlist`;
      this.watchlistAlert.type = 'success';
      watchlist = this.state.readFromLocalStorage('watchlist');
      if(watchlist == null) {
        watchlist = [];
      }
      if(watchlist.indexOf(ticker)==-1) {
        watchlist.push(ticker);
        this.state.addToLocalStorage('watchlist', watchlist);
      }
    } else {
      this.watchlistAlert.msg = `${ticker} removed from Watchlist`;
      this.watchlistAlert.type = 'danger';
      watchlist = this.state.readFromLocalStorage('watchlist');
      if(watchlist != null) {
        let index = watchlist.indexOf(ticker);
        if (index > -1) {
          watchlist.splice(index, 1); // 2nd parameter means remove one item only
        }
        this.state.addToLocalStorage('watchlist', watchlist);
      }
    }
    this.state.addSearchPageFlags({showWatchlistAlert: true});
    if(this.timeoutObject != null) {
      clearTimeout(this.timeoutObject);
    }
    this.timeoutObject = setTimeout(() => {this.selfClosingAlert.close(); this.timeoutObject = null}, 2000);
  }

  /* Alert */
  closeAlert() {
    this.state.addSearchPageFlags({invalidTicker: false});
  }
  
}

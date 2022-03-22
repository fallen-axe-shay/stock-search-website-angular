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

  intervalObject: any;

  requestURLs: any = {
    autocomplete: ['AutoComplete', '/api/getAutocompleteData'],
    companyProfile: ['Profile', '/api/getCompanyProfile'],
    companyQuote: ['Stock', '/api/getCompanyQuote'],
    companyPeers: ['Peers', '/api/getCompanyPeers'],
    companyHistoricalData: ['CompanyHistory', '/api/getCompanyHistoricalData']
  }

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private location: Location, public state: StateService) {
    this.suggestions = [];
    this.noRequests = 0;
    this.currentRequest = 0;
    this.queryResult = {};
    this.setCurrentTime();
    this.state.getSearchPageFlags()['resultsReady'] && this.clearSearchInterval();
    this.intervalObject = null;
    this.state.getSearchPageFlags()['resultsReady'] && this.setSearchInterval(this.state.getStockData()['ticker']);
   }

   @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
   @ViewChild(SearchSummaryComponent) searchSummary: SearchSummaryComponent;

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
    this.makeRequests(ticker);
  }

  resetURL(): void {
    this.location.replaceState("/search/home");
    this.state.addSearchPageFlags({resultsReady: false, isSearching: false});
    this.intervalObject && clearInterval(this.intervalObject);
  }

  changeURL(ticker): void {
    this.location.replaceState(`/search/${ticker}`);
  }

  searchTicker($event: any) {
    let ticker = Array.isArray($event) ? $event[0].toUpperCase() : $event.toUpperCase();
    this.clearSearchInterval();
    this.intervalObject = null;
    this.queryResult = {};
    this.state.addSearchPageFlags(
        {
          resultsReady: false, 
          isSearching: true,
          logoError: false,
          isProfit: false,
          currentSearch: ticker
        }
      );
    this.state.setStockData({});
    !Array.isArray($event) && this.changeURL(ticker);
    this.getStockDetails(ticker);
  }

  clearSearchInterval() {
    this.intervalObject && clearInterval(this.intervalObject);
  }

  makeRequests(ticker, refresh = false) {
    return new Promise((resolve, reject) => {
      let resCount = 0;
      let requests = [this.requestURLs.companyProfile, this.requestURLs.companyQuote, this.requestURLs.companyPeers];
      requests.forEach((item)=> {
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
            default:
              //Do nothing
          }
          this.queryResult = Object.assign({...res}, {...this.queryResult});
          if(resCount==requests.length) {
            let datetime = new Date(this.queryResult['t']*1000);
            this.queryResult['t_unix'] = this.queryResult['t'];
            this.state.addSearchPageFlags({isMarketOpen: ((((new Date()).getTime())/1000 - datetime.getTime()/1000)<(5*60))});
            var date = datetime.getFullYear()+'-'+this.zeroPad(datetime.getMonth()+1, 2)+'-'+this.zeroPad(datetime.getDate(),2);
            var time = this.zeroPad(datetime.getHours(),2) + ":" + this.zeroPad(datetime.getMinutes(),2) + ":" + this.zeroPad(datetime.getSeconds(),2);
            this.queryResult['t'] = date + ' ' + time;
            let change = this.queryResult['d'];
            if(change>0) {
              this.state.addSearchPageFlags({isProfit: true});
            }
            this.queryResult['d'] = Math.abs(this.queryResult['d']).toFixed(2);
            this.queryResult['dp'] = Math.abs(this.queryResult['dp']).toFixed(2);
            this.state.addStockData(this.queryResult);
            !refresh && this.state.addSearchPageFlags({resultsReady: true, isSearching: false});
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
    });

  }

  showError(): void {
    this.state.addSearchPageFlags({isSearching: false});
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0');
  }
  
}

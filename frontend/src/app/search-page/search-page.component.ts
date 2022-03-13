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

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  isLoading: Boolean;

  searchForm = new FormGroup({
    searchFormControl: new FormControl('')
  });

  suggestions: any;

  noRequests: any;
  currentRequest: any;
  isStarred: Boolean;
  isSearching: Boolean;
  resultsReady: Boolean;
  queryResult: any;
  logoError: Boolean;
  isProfit: Boolean;

  requestURLs: any = {
    autocomplete: ['AutoComplete', '/api/getAutocompleteData'],
    companyProfile: ['Profile', '/api/getCompanyProfile'],
    companyQuote: ['Stock', '/api/getCompanyQuote']
  }

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private location: Location, private state: StateService) {
    this.isLoading = false;
    this.suggestions = [];
    this.noRequests = 0;
    this.currentRequest = 0;
    this.isStarred = false;
    this.isSearching = false;
    this.resultsReady = false;
    this.queryResult = {};
    this.logoError = false;
    this.isProfit = false;
   }

   @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  ngOnInit(): void {
    let ticker = this.route.snapshot.params.ticker;
    if(ticker.toLowerCase().trim()!='home') {
      this.searchForm.get('searchFormControl').setValue(ticker);
      this.searchTicker(ticker);
    }
    this.searchForm.get('searchFormControl').valueChanges.subscribe((query)=> {
      query = query.toUpperCase();
      this.noRequests += 1;
      this.isLoading = true;
      this.suggestions =[];
      this.getAutoCompleteDetails(query).then((val) => {
        this.currentRequest += 1;
        if(this.noRequests == this.currentRequest) {
          this.isLoading = false;
          this.suggestions = val;
        }
      }).catch(()=>{
        this.suggestions = []; 
        this.currentRequest += 1;
      });
    });
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
    this.resultsReady = false;
    this.isSearching = false;  }

  changeURL(ticker): void {
    this.location.replaceState(`/search/${ticker}`);
  }

  searchTicker(ticker) {
    this.isSearching = true;
    this.resultsReady = false;
    this.queryResult = {};
    this.logoError = false;
    this.isProfit = false;
    this.changeURL(ticker);
    this.getStockDetails(ticker);
  }

  makeRequests(ticker): void {
    let resCount = 0;
    let requests = [this.requestURLs.companyProfile, this.requestURLs.companyQuote];
    requests.forEach((item)=> {
      let url = `${item[1]}/${ticker}`;
      this.httpClient.get(url).subscribe((res)=>{
        resCount++;
        if(resCount==requests.length) {
          this.isSearching = false;
          this.resultsReady = true;
        }
        console.log(item[0], ticker)
        this.queryResult = Object.assign(res, this.queryResult); 
        switch(item[0]) {
          case 'Profile':
            break;
          case 'Stock':
            let datetime = new Date(this.queryResult['t']*1000);
            var date = datetime.getFullYear()+'-'+this.zeroPad(datetime.getMonth()+1, 2)+'-'+this.zeroPad(datetime.getDate(),2);
            var time = this.zeroPad(datetime.getHours(),2) + ":" + this.zeroPad(datetime.getMinutes(),2) + ":" + this.zeroPad(datetime.getSeconds(),2);
            this.queryResult['t'] = date + ' ' + time;
            let change = this.queryResult['d'];
            if(change>0) {
              this.isProfit = true;
            }
            this.queryResult['d'] = Math.abs(this.queryResult['d']).toFixed(2);
            this.queryResult['dp'] = Math.abs(this.queryResult['dp']).toFixed(2);
            break;
        }
      }, (error)=>this.showError());
    });
  }

  showError(): void {
    this.isSearching = false;
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0');
  }
  
}

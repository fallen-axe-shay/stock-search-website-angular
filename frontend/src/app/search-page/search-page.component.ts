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
   }

   @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  ngOnInit(): void {
    let ticker = this.route.snapshot.params.ticker;
    if(ticker.toLowerCase().trim()!='home') {
      this.searchForm.get('searchFormControl').setValue(ticker);
      this.getStockDetails(ticker.toLowerCase().trim());
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
    //TODO:
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
        let result = res;
        //TODO:
        console.log(result)
        this.queryResult = Object.assign(result, this.queryResult); 
        switch(item[0]) {
          case 'Profile':
            break;
          case 'Stock':
            break;
        }
      }, (error)=>this.showError());
    });
  }

  showError(): void {

  }
  
}

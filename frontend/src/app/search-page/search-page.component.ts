import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Location} from '@angular/common';
import { tick } from '@angular/core/testing';
import { ThrowStmt } from '@angular/compiler';

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

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private location: Location) {
    this.isLoading = true;
    this.suggestions = [];
    this.noRequests = 0;
    this.currentRequest = 0;
   }

  ngOnInit(): void {
    let ticker = this.route.snapshot.params.ticker;
    if(ticker.toLowerCase().trim()!='home') {
      this.searchForm.get('searchFormControl').setValue(ticker);
      this.getStockDetails(ticker.toLowerCase().trim());
    }
    this.searchForm.get('searchFormControl').valueChanges.subscribe((query)=> {
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
      this.httpClient.get(`/api/getAutocompleteData/${ticker}`).subscribe((res)=>{
        let result = res['result'];
        result = result.filter(item => item['type'].toLowerCase().includes('common stock'));
        result = result.slice(0,5);
        resolve([...result]);
      }, (error)=>reject());
    });
  }

  getStockDetails(ticker): void {
    //TODO:
  }

  resetURL(): void {
    this.location.replaceState("/search/home");
  }

  changeURL(ticker): void {
    this.location.replaceState(`/search/${ticker}`);
  }

  searchTicker(ticker) {
    this.changeURL(ticker);
    this.getStockDetails(ticker);
  }
  
}

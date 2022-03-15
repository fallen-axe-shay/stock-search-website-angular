import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class StateService {

  readonly _stockData = new BehaviorSubject<any>({});
  readonly _searchPageFlags = new BehaviorSubject<any>({
                                                        isLoading: false,
                                                        isStarred: false,
                                                        isSearching: false,
                                                        resultsReady: false,
                                                        logoError: false,
                                                        isProfit: false,
                                                        isMarketOpen: false,
                                                        currentSearch: ''
                                                      });


  get stockData(): any {
    return this._stockData.getValue();
  }

  get searchPageFlags(): any {
    return this._searchPageFlags.getValue();
  }


  set stockData(val: any) {
    this._stockData.next(val);
  }

  set searchPageFlags(val: any) {
    this._searchPageFlags.next(val);
  }

  addStockData(data: any) {
    this.stockData = Object.assign(this.stockData, data); 
  }

  addSearchPageFlags(data: any) {
    this.searchPageFlags = Object.assign(this.searchPageFlags, data); 
  }

  setStockData(data: any) {
    this.stockData = data;
  }

  setSearchPageFlags(data: any) {
    this.searchPageFlags = data;
  }

  getStockData() {
    return this.stockData;
  }

  getSearchPageFlags() {
    return this.searchPageFlags;
  }

}
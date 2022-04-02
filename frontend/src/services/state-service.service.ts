import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class StateService {

  readonly _stockData = new BehaviorSubject<any>({});
  readonly _searchPageFlags = new BehaviorSubject<any>({
                                                        isLoading: false,
                                                        isSearching: false,
                                                        resultsReady: false,
                                                        logoError: false,
                                                        isMarketOpen: false,
                                                        currentSearch: '',
                                                        invalidTicker: false,
                                                        noStockData: false,
                                                        showWatchlistAlert: false,
                                                        invalidPurchase: false,
                                                        showBuyAlert: false,
                                                        showSellAlert: false,
                                                        isHistoricChartReady: false,
                                                        isEarningDataPresent: true,
                                                        isRecommendationChartReady:  false,
                                                        isHistoricalEPSChartReady: false,
                                                        showPortfolioBuyAlert: false,
                                                        showPortfolioSellAlert: false
                                                      });
  readonly _navBarMenu = new BehaviorSubject<any>({});
  readonly _currentBuySellDetails = new BehaviorSubject<any>({});

  localStorage: any = window.localStorage;
  highChartsDataVar: any;
  highChartsHistoricalEPSVar: any;
  highChartsRecommendationVar: any;

  get stockData(): any {
    return this._stockData.getValue();
  }

  get searchPageFlags(): any {
    return this._searchPageFlags.getValue();
  }

  get navBarMenu(): any {
    return this._navBarMenu.getValue();
  }

  get modalContent(): any {
    return this._currentBuySellDetails.getValue();
  }

  set stockData(val: any) {
    this._stockData.next(val);
  }

  set modalContent(val: any) {
    this._currentBuySellDetails.next(Object.assign(this.modalContent, val));
  }


  set navBarMenu(val: any) {
    this._navBarMenu.next(val);
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

  addToLocalStorage(key, value) {
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  readFromLocalStorage(key) {
    return JSON.parse(this.localStorage.getItem(key));
  }

  removeFromLocalStorage(key) {
    let item = JSON.parse(this.localStorage.getItem(key));
    this.localStorage.removeItem(key);
    return item;
  }

  getWalletAmount() {
    return this.readFromLocalStorage('wallet');
  }

  setWalletAmount(amount) {
    this.addToLocalStorage('wallet', amount);
  }

  setHighChartsData(data) {
    this.highChartsDataVar = data;
  }

  getHighChartsData() {
    return this.highChartsDataVar;
  }

  setHistoricalEPSChartsData(data) {
    this.highChartsHistoricalEPSVar = data;
  }

  getHistoricalEPSChartsData() {
    return this.highChartsHistoricalEPSVar;
  }

  setRecommendationChartsData(data) {
    this.highChartsRecommendationVar = data;
  }

  getRecommendationChartsData() {
    return this.highChartsRecommendationVar;
  }

}
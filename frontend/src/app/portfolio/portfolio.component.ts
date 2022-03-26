import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StateService } from 'src/services/state-service.service';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import { BuyStockModalComponent } from '../buy-stock-modal/buy-stock-modal.component';
import { SellStockModalComponent } from '../sell-stock-modal/sell-stock-modal.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  @ViewChild('selfClosingAlertBuy', {static: false}) selfClosingAlertBuy: NgbAlert;
  @ViewChild('selfClosingAlertSell', {static: false}) selfClosingAlertSell: NgbAlert;
  @ViewChild(BuyStockModalComponent) buyStockModal: BuyStockModalComponent;
  @ViewChild(SellStockModalComponent) sellStockModal: SellStockModalComponent;

  requestURLs: any = ['/getCompanyProfile', '/getCompanyQuote'];

  portfolioList: any;
  portfolioData: any;
  timeoutObjectBuySell: any;

  constructor(public state: StateService, private httpClient: HttpClient) { 
    this.portfolioList = this.state.readFromLocalStorage('stocks');
    if(this.portfolioList==undefined) {
      this.portfolioList = {};
    }
    this.portfolioData = {};
    this.timeoutObjectBuySell = null;
  }

  getTotalCost(data) {
    return (data.map((item)=>item['amount'])).reduce((prev, cur) => { return (prev + cur) });
  }

  ngOnInit(): void {
    this.fetchAPIData();
  }

  fetchAPIData() {
    Object.keys(this.portfolioList).forEach((ticker)=>{
      this.portfolioData[ticker] = {};
      this.requestURLs.forEach((url)=> {
        url = `${url}/${ticker}`;
        this.httpClient.get(url).subscribe((res)=>{
          this.portfolioData[ticker] = Object.assign(this.portfolioData[ticker], res);
      });
      })
    });
  }


  showBuyAlert($event) {
    this.state.addSearchPageFlags({showPortfolioBuyAlert: true, showPortfolioSellAlert: false});
    if(this.timeoutObjectBuySell != null) {
      clearTimeout(this.timeoutObjectBuySell);
    }
    this.timeoutObjectBuySell = setTimeout(() => {this.selfClosingAlertBuy.close(); this.timeoutObjectBuySell = null}, 2000);
    this.portfolioList = this.state.readFromLocalStorage('stocks');
  }

  showSellAlert($event) {
    this.state.addSearchPageFlags({showPortfolioSellAlert: true, showPortfolioBuyAlert: false});
    if(this.timeoutObjectBuySell != null) {
      clearTimeout(this.timeoutObjectBuySell);
    }
    this.timeoutObjectBuySell = setTimeout(() => {this.selfClosingAlertSell.close(); this.timeoutObjectBuySell = null}, 2000);
    this.portfolioList = this.state.readFromLocalStorage('stocks');
  }

  clearBuySellAlert() {
    this.state.addSearchPageFlags({showPortfolioSellAlert: false, showPortfolioBuyAlert: false});
  }

  openModal(type, price, ticker) {
    this.state.modalContent = {price: price, ticker: ticker};
    type=='buy' ? this.buyStockModal.open() : this.sellStockModal.open();
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/services/state-service.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  requestURLs: any = ['/api/getCompanyProfile', '/api/getCompanyQuote'];

  portfolioList: any;
  portfolioData: any;

  constructor(public state: StateService, private httpClient: HttpClient) { 
    this.portfolioList = this.state.readFromLocalStorage('stocks');
    if(this.portfolioList==undefined) {
      this.portfolioList = {};
    }
    this.portfolioData = {};
  }

  getTotalCost(data) {
    return (data.map((item)=>item['amount'])).reduce((prev, cur) => { return (prev + cur) });
  }

  ngOnInit(): void {
    console.log(this.portfolioList)
    this.portfolioList.to
    Object.keys(this.portfolioList).forEach((ticker)=>{
      this.portfolioData[ticker] = {};
      this.requestURLs.forEach((url)=> {
        url = `${url}/${ticker}`;
        this.httpClient.get(url).subscribe((res)=>{
          this.portfolioData[ticker] = Object.assign(this.portfolioData[ticker], res);
          console.log(this.portfolioData)
      });
      })
    });
  }

}

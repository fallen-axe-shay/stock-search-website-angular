import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from 'src/services/state-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public state: StateService, router: Router) {
    if(this.state.getWalletAmount()==null) {
      this.state.setWalletAmount(25000);
    }
    setTimeout(() => {
      if(router.url.includes('search')) {
        this.state.navBarMenu = 'search';
      } else if(router.url.includes('watchlist')) {
        this.state.navBarMenu = 'watchlist';
      } else if(router.url.includes('portfolio')) {
        this.state.navBarMenu = 'portfolio';
      }
    });
  }

  getChartData() {
    this.state.addSearchPageFlags({isHistoricChartReady: false, isRecommendationChartReady: false, isHistoricalEPSChartReady: false});
  }

  changeNavBar(selected) {
    this.state.navBarMenu = selected;
  }

  title = 'Search Page';
  isMenuCollapsed = true;
}

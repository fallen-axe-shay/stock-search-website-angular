import { Component, ViewChild } from '@angular/core';
import { StateService } from 'src/services/state-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private state: StateService) {
    if(this.state.getWalletAmount()==null) {
      this.state.setWalletAmount(25000);
    }
  }

  getChartData() {
    this.state.addSearchPageFlags({isHistoricChartReady: false});
  }

  title = 'Search Page';
  isMenuCollapsed = true;
  selectedNavItem = 'search';
}

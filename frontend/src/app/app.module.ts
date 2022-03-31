import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchPageComponent } from './search-page/search-page.component';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import { SearchSummaryComponent } from './search-summary/search-summary.component';
import { SearchTopNewsComponent } from './search-top-news/search-top-news.component';
import { SearchChartsComponent } from './search-charts/search-charts.component';
import { SearchInsightsComponent } from './search-insights/search-insights.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { BuyStockModalComponent } from './buy-stock-modal/buy-stock-modal.component';
import { SellStockModalComponent } from './sell-stock-modal/sell-stock-modal.component';
import { NewsModalComponent } from './news-modal/news-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    WatchlistComponent,
    PortfolioComponent,
    SearchSummaryComponent,
    SearchTopNewsComponent,
    SearchChartsComponent,
    SearchInsightsComponent,
    BuyStockModalComponent,
    SellStockModalComponent,
    NewsModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    HighchartsChartModule,
    RouterModule.forRoot([
    { path: 'search/:ticker', component: SearchPageComponent },
    { path: '', redirectTo: 'search/home', pathMatch: 'full' },
    { path: 'search', redirectTo: 'search/home', pathMatch: 'full' },
    { path: 'watchlist', component: WatchlistComponent },
    { path: 'portfolio', component: PortfolioComponent },
    { path: '**', component: SearchPageComponent } // Wildcard route for a 404 page
], { relativeLinkResolution: 'legacy' })
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchPageComponent } from './search-page/search-page.component';
import { RouterModule } from '@angular/router';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    WatchlistComponent,
    PortfolioComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot([
      {path: 'search/home', component: SearchPageComponent},
      {path: '', redirectTo: '/search/home', pathMatch: 'full'},
      {path: 'watchlist', component: WatchlistComponent},
      {path: 'portfolio', component: PortfolioComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

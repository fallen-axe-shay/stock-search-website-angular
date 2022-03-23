import { Component, OnInit, ViewChild } from '@angular/core';
import { StateService } from 'src/services/state-service.service';
import { NewsModalComponent } from '../news-modal/news-modal.component';

@Component({
  selector: 'app-search-top-news',
  templateUrl: './search-top-news.component.html',
  styleUrls: ['./search-top-news.component.css']
})
export class SearchTopNewsComponent implements OnInit {

  @ViewChild(NewsModalComponent) newsModal: NewsModalComponent;

  newsItems: any;

  constructor(public state: StateService) { 
    this.newsItems = [];
  }

  ngOnInit(): void {
    let curCount = 5;
    for(var i = 0; i<Math.min(curCount, this.state.getStockData().news.length); i++) {
      let item = this.state.getStockData().news[i];
      if(item.image=='' || item.headline=='') {
        curCount++;
        continue;
      } else {
        this.newsItems.push(item);
      }
    }
  }

  displayNewsModal(news) {
    this.newsModal.open(news);
  }



}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTopNewsComponent } from './search-top-news.component';

describe('SearchTopNewsComponent', () => {
  let component: SearchTopNewsComponent;
  let fixture: ComponentFixture<SearchTopNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchTopNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTopNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

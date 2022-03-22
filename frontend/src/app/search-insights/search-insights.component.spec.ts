import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInsightsComponent } from './search-insights.component';

describe('SearchInsightsComponent', () => {
  let component: SearchInsightsComponent;
  let fixture: ComponentFixture<SearchInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInsightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChartsComponent } from './search-charts.component';

describe('SearchChartsComponent', () => {
  let component: SearchChartsComponent;
  let fixture: ComponentFixture<SearchChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

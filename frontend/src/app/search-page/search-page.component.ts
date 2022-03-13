import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  options: any;
  searchForm = new FormGroup({
    searchFormControl: new FormControl('')
  });
  filteredOptions: Observable<string[]>;

  constructor() {
    this.options = ['One', 'Two', 'Three'];
   }

  ngOnInit(): void {
    this.filteredOptions = this.searchForm.get('searchFormControl').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  
}

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class StateService {

    // - We set the initial state in BehaviorSubject's constructor
  // - Nobody outside the Store should have access to the BehaviorSubject 
  //   because it has the write rights
  // - Writing to state should be handled by specialized Store methods (ex: addTodo, removeTodo, etc)
  // - Create one BehaviorSubject per store entity, for example if you have TodoGroups
  //   create a new BehaviorSubject for it, as well as the observable$, and getters/setters
  private readonly _stockData = new BehaviorSubject<any>([]);

  // Expose the observable$ part of the _todos subject (read only stream)
  readonly stockData$ = this._stockData.asObservable();


  // the getter will return the last value emitted in _todos subject
  get stockData(): any {
    return this._stockData.getValue();
  }


  // assigning a value to this.todos will push it onto the observable 
  // and down to all of its subsribers (ex: this.todos = [])
  set stockData(val: any) {
    this._stockData.next(val);
  }

  addStockData(title: string) {
    // we assaign a new copy of todos by adding a new todo to it 
    // with automatically assigned ID ( don't do this at home, use uuid() )
    this.stockData = [
      ...this.stockData, 
      {id: this.stockData.length + 1, title, isCompleted: false}
    ];
  }

  removeStockData(id: number) {
    this.stockData = this.stockData.filter(todo => todo.id !== id);
  }


  setCompleted(id: number, isCompleted: boolean) {
    let todo = this.stockData.find(todo => todo.id === id);
  
    if(todo) {
      // we need to make a new copy of todos array, and the todo as well
      // remember, our state must always remain immutable
      // otherwise, on push change detection won't work, and won't update its view    
  
      const index = this.stockData.indexOf(todo);
      this.stockData[index] = {
        ...todo,
        isCompleted
      }
      this.stockData = [...this.stockData];
    }
  }

  readonly completedStockData$ = this.stockData$.pipe(
    map(stockData => stockData.filter(item => item.isCompleted))
  )

}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  isSelectedSubject = new Subject<boolean>()
  isSelected$ = this.isSelectedSubject.asObservable()

  currentSelectedSubject = new Subject<string>()
  currentSelected$ = this.currentSelectedSubject.asObservable()

  constructor() { }

  setSelected(selected){
    console.log('current selected: ', selected);
    this.currentSelectedSubject.next(selected)
  }

  getSelected(){
    return this.currentSelectedSubject.asObservable()
  }

  
}

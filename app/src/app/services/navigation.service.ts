import { Injectable } from '@angular/core';


import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as Rx from 'rxjs/Rx';


@Injectable()
export class NavigationService {


  public GoogleGeocodingSubject: Subject<any>;

  constructor() {

    this.GoogleGeocodingSubject = new Subject<any>();

  }





}

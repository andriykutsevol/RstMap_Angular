import { Component, AfterViewInit } from '@angular/core';
import { WebsocketServiceService } from '../../services/websocket-service.service';

import { Observable, Subject } from 'rxjs/Rx';

// https://www.mashvisor.com/


@Component({
	templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
  subtitle:string;


  constructor( private wsService: WebsocketServiceService)
  {}


  socketConnect(msg){



  }


  socketClose(){

  }

  sendMsg(msg){

  }


	ngAfterViewInit(){}
}

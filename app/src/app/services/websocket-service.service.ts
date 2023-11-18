import { Injectable } from '@angular/core';


import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { AppConfig } from '../../app.config';


import {NgbdModalBasic} from "../pages/component/modal/modal.component";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class WebsocketServiceService {


  private dataset_socket: any;

  public connection: any;

  private modalRef: any;

  constructor(
    private appConfig: AppConfig,
    private modalService: NgbModal
  ) {


    this.dataset_socket = io(this.appConfig.wsbackendUrl + '/datasets');


    this.dataset_socket.on('connect_error', () => {
      this.modalRef = this.modalService.open(NgbdModalBasic);
      this.modalRef.componentInstance.set_title('Connection error.');
      this.modalRef.componentInstance.set_body('WebSocket error. Please contact support.');
      this.dataset_socket.close();
    });



    this.dataset_socket.on('connect', () => {
      console.log('connect');
      this.dataset_socket.emit('join', {room: this.dataset_socket.id});
    });


  }

  //----------------------------------------
  // End of the constructor.


  init_connect(){
    this.connection = this.datasets_connect();
  }


  datasets_connect(): Rx.Subject<MessageEvent> {




      // WHEN RECIEVE
      let observable = new Observable(observer => {
        this.dataset_socket.on('datasets_response', (data) => {
          observer.next(data);
        });

      });


      // WHEN SEND
      let observer = {
        next: (data: any) => {

          console.log('next');

          let on_get = ''

          if (data['type'] == 'zip'){
            on_get = 'get_areabased_data';
          }else if(data['type'] == 'city'){
            on_get = 'get_citybased_data';
          }else if(data['type'] == 'location'){
            on_get = 'get_locationbased_data';
          }else if(data['type'] == 'school_district'){
            on_get = 'get_sdbased_data';
          }


          this.dataset_socket.emit(on_get, {
            'room': this.dataset_socket.id,
            'json_coords': data.json_coords,
            'table_name': data.table_name,
            'field_name': data.field_name
          });


        },
        error: () => {
          this.dataset_socket.disconnect();
          this.dataset_socket.close();
        }
      };


      // we return our Rx.Subject which is a combination
      // of both an observer and observable.
      return Rx.Subject.create(observer, observable);



  }


}

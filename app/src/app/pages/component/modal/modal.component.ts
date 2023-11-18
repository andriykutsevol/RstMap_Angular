import { Component, ViewEncapsulation, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal',
	templateUrl: './modal.component.html',
	encapsulation: ViewEncapsulation.None,
	styles: [`
    .dark-modal .modal-content {
      background-color: #009efb;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
  `]
})

export class NgbdModalBasic {
  closeResult: string;

  public modal_title:string;
  public modal_body: string;
  public additional_info: string;

  public confirm_event = new EventEmitter<string>();
  public reject_event = new EventEmitter<string>();

  public show_confirm_button:boolean;
  public show_reject_button:boolean;
  public show_close_button:boolean;


  constructor(public activeModal: NgbActiveModal) {

    this.modal_title = '';
    this.modal_body = '';
    this.additional_info = '';

    this.show_confirm_button = false;
    this.show_reject_button = false;
    this.show_close_button = true;

  }

  confirm(){
    this.confirm_event.emit('confirmed');
  }

  reject(){
    this.reject_event.emit('rejected');
  }

  set_title(title:string){
    this.modal_title = title;
  }

  set_body(body:string){
    this.modal_body = body;
  }

  set_additional_info(string:string){
    this.additional_info = string;
  }



}




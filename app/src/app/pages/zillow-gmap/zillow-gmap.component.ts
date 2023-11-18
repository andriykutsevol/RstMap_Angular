import { Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";




import { GmapService } from "../../services/gmap.service";
import { NavigationService } from '../../services/navigation.service';


import { Observable, Subject } from "rxjs/Rx";



import {NgbdModalBasic} from "../component/modal/modal.component";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { MarksComponent } from '../component/marks/marks.component';
import { WebsocketServiceService } from '../../services/websocket-service.service';




@Component({
  selector: "app-zillow-gmap",
  templateUrl: "./zillow-gmap.component.html",
  styleUrls: ["./zillow-gmap.component.scss"]
})
export class ZillowGmapComponent implements AfterViewInit {


  // let el = this._elementRef.nativeElement.querySelector('.contact-us');
  @ViewChild("gmap", { read: ElementRef })
  gmap_ref: ElementRef;

  @ViewChild(MarksComponent) markscomponent: MarksComponent;

  google_api: any;

  constructor(
    private gmapservice: GmapService,
    private navigationservice: NavigationService,
    private modalService: NgbModal,
    private wsService: WebsocketServiceService
  ) {

    this.wsService.init_connect();

    //https://developers.google.com/maps/documentation/javascript/geocoding

    this.navigationservice.GoogleGeocodingSubject.subscribe(

      data => {

        console.log(data);

        //----------------------
        // Setup the boundaries

        if(data.data['status'] == 'OK'){

          let raw_bounds:any = {}

          let geometry = data.data.results[0].geometry

          if(geometry.bounds){
            console.log('BOUNDS');
            raw_bounds = geometry.bounds;
          }else{
            console.log('ViewPort');
            raw_bounds = geometry.viewport;
          }


          let sw = new this.gmapservice.google.maps.LatLng({lat: raw_bounds.southwest.lat, lng: raw_bounds.southwest.lng});
          let ne = new this.gmapservice.google.maps.LatLng({lat: raw_bounds.northeast.lat, lng:raw_bounds.northeast.lng});
          let bounds = new this.gmapservice.google.maps.LatLngBounds(sw,ne);
          this.gmapservice.gmap.fitBounds( bounds );


          //----------------------
          // Marker setup

          let myLatLng = {
            lat: geometry.location['lat'],
            lng: geometry.location['lng']
          };


          let search_info = {};
          search_info['formatted_address'] = data.data.results[0]['formatted_address'];

          let addr_types = ''
          data.data.results[0]['types'].forEach(element => {
            addr_types += element + ', ';
          });

          search_info['address_types'] = addr_types.replace(/^,+|,+$/g, '');


          search_info['location_type'] = geometry['location_type'];

          //--------------------------
          // Create a new Marker

          let marker = new this.gmapservice.google.maps.Marker({
            position: myLatLng,
            map: this.gmapservice.gmap,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            search_info: search_info
          });


          this.markscomponent.get_markers();

          this.markscomponent.setup_marker(marker);

          console.log(this.markscomponent.all_markers);


        }else{
          this.openGeocodingModal(data.data['status']);
        }




      });


  }

  //End of constructor
  //------------------------------------------------


  setup_tab(tabid:any){

    //console.log('setup_tab()' + tabid);

  }


  // =================================
  ngAfterViewInit() {


    var slimscrollH = window.innerHeight - 300 + "px";

    (<any>$(".slimscrollable")).slimScroll({
      position: "right",
      size: "7px",
      height: slimscrollH,
      color: "#000000",
      alwaysVisible: true
    });


    var height = window.innerHeight;
    $("#gmap").css("min-height", height - 50 + "px");
    $(".progress").hide();


    this.gmapservice.load_gmap($('#gmap')[0], 42.361145, -71.057083, 12).subscribe(
      data => {
        this.gmapservice.gmap_subject.next('gmap&google has been loaded');
      }
    )


  }
  //=========== End of ngAfterViewInit() ===========


  //=================================================
  // Modals



  closeResult: string;
  modalRef: any;


  openGeocodingModal(status:string) {

    this.modalRef = this.modalService.open(NgbdModalBasic);

    this.modalRef.componentInstance.set_title('Nothing Found');
    this.modalRef.componentInstance.set_body('Search result is empty.');
    this.modalRef.componentInstance.set_additional_info(status);


    //------------- Default events ---------------------

    this.modalRef.result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
      // console.log("closeResult: " + this.closeResult);
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // console.log("closeResult: " + this.closeResult);
    });

  }

  // End of openModal()
  //===================================


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }



  // End of Modals.
  //=================================================



  ngOnDestroy() {
    console.log('Zillow Gmap');
    this.wsService.connection.error({});
  }

}

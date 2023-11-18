import { Component, OnInit } from '@angular/core';

import { GmapService } from '../../../services/gmap.service';

import { WebsocketServiceService } from '../../../services/websocket-service.service';
import { RestapiService } from '../../../services/restapi.service';


import {NgbdModalBasic} from "../modal/modal.component";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { concat } from 'rxjs/operators/concat';



@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss']
})
export class MarksComponent implements OnInit {


  public current_marker: any;
  public all_markers: any[]; // Array<Type> VS Type[]
  is_edit_marker: boolean;

  constructor(

    private wsService: WebsocketServiceService,
    private apiService: RestapiService,
    private gmapservice: GmapService,
    private modalService: NgbModal

  ) {

    this.gmapservice.gmap_subject.subscribe(
      data => {
        this.get_markers();
        this.setup_listeners();
      }
    );

    this.all_markers = [];
    this.is_edit_marker = false;

  }

  ngOnInit() {
  }


  //--------------------------------------------

  setup_marker(marker:any){

    this.marks_tored();


    this.current_marker = marker;
    this.all_markers.push(this.current_marker);

    $("#marker_lat").val(marker.position.lat());
    $("#marker_lng").val(marker.position.lng());

    $("#marker_mode_switcher").prop("checked", false);


    if(marker['search_info']){

      let descr = 'Formatted address: ' + marker['search_info']['formatted_address'] + '\n';
      descr += 'Address types: ' + marker['search_info']['address_types'] + '\n';
      descr += 'Location type: ' + marker['search_info']['location_type'] + '\n';

      $("#marker_descr").val(descr);
    }


    marker.addListener("click", () => {
      this.click_on_marker(marker);
    });


  }

  //--------------------------------------------

  setup_listeners(){



    this.gmapservice.google.maps.event.addListener(this.gmapservice.gmap, "click", event => {
      if ($("#marker_mode_switcher").prop("checked")) {

        //--------------------------
        // Create a new Marker

        let marker = new this.gmapservice.google.maps.Marker({
          position: event.latLng,
          map: this.gmapservice.gmap,
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });

        this.setup_marker(marker)


      }

    });


    //--------------------------------------------


    this.gmapservice.zipLayer.addListener("click", event => {

      try{


        if ($("#marker_mode_switcher").prop("checked")) {


          // If click on data layer - add feature info
          // to the descripttion field.
          let descr = '';
          event.feature.forEachProperty( (val,name) => {
            if(name == 'POSITION'){
            }else if(name == 'state'){
            }else{
              descr += name + ': ' + val + '\n'
            }

          } );

          //--------------------------
          // Create a new Marker


          let marker = new this.gmapservice.google.maps.Marker({
            position: event.latLng,
            map: this.gmapservice.gmap,
            mark_descr: descr,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          });

          this.setup_marker(marker);

          $("#marker_descr").val(descr);
        }


      }catch(err){
        console.log(err);
      }


    });

    //---------------------------------

    this.gmapservice.google.maps.event.addListener(this.gmapservice.gmap, "mousemove", event => {
      if ($("#marker_mode_switcher").prop("checked")) {
        $("#marker_lat").val(event.latLng.lat());
        $("#marker_lng").val(event.latLng.lng());
      }
    });

    this.gmapservice.zipLayer.addListener("mousemove", event => {
      if ($("#marker_mode_switcher").prop("checked")) {
        $("#marker_lat").val(event.latLng.lat());
        $("#marker_lng").val(event.latLng.lng());
      }
    });


  }



  marks_tored() {
    try {
      this.all_markers.forEach(marker => {
        marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
      });
    } catch (err) {
      console.log("error");
      console.log(err);
    }
  }

  clear_marker_form() {
    // https://www.bennadel.com/blog/3205-using-form-controls-without-formsmodule-or-ngmodel-in-angular-2-4-1.htm
    // https://www.concretepage.com/angular-2/angular-2-radio-button-and-checkbox-example

    $("#marker_title").val("");
    $("#marker_descr").val("");
    $("#marker_lat").val("");
    $("#marker_lng").val("");
  }

  click_on_marker_mode_switcher() {
    this.clear_marker_form();
    $("#save_mark_btn").text("Save");
    this.is_edit_marker = false;
    this.get_markers();
  }

  delete_marker() {

    this.openDeleteMarkerModal();

  }


    // http://maps.google.com/mapfiles/ms/icons/blue-dot.png
  // http://maps.google.com/mapfiles/ms/icons/red-dot.png
  // http://maps.google.com/mapfiles/ms/icons/purple-dot.png
  // http://maps.google.com/mapfiles/ms/icons/yellow-dot.png
  // http://maps.google.com/mapfiles/ms/icons/green-dot.png

  // down vote
  // If you use Google Maps API v3 you can use setIcon e.g.

  // marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
  // Or as part of marker init:

  // marker = new google.maps.Marker({
  //     icon: 'http://...'
  // });

  click_on_marker(marker) {


    console.log(marker);

    if (marker["mark_id"]) {
      this.marks_tored();

      this.current_marker = marker;
      this.current_marker.setIcon(
        "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      );

      // https://www.bennadel.com/blog/3205-using-form-controls-without-formsmodule-or-ngmodel-in-angular-2-4-1.htm
      // https://www.concretepage.com/angular-2/angular-2-radio-button-and-checkbox-example

      $("#marker_lat").val(marker.position.lat());
      $("#marker_lng").val(marker.position.lng());

      $("#marker_descr").val(marker["mark_descr"]);
      $("#marker_title").val(marker["mark_title"]);

      this.is_edit_marker = true;
      $("#save_mark_btn").text("Edit");

      $("#marker_mode_switcher").prop("checked", false);
    } else {
      console.log("Marker is not saved.");
    }
  }

  get_markers() {

    try {
      this.all_markers.forEach(marker => {
        marker.setMap(null);
      });
    } catch (err) {
      console.log("error");
      console.log(err);
    }

    this.all_markers = [];

    this.apiService.get_markers().subscribe(
      data => {
        data.forEach(mark => {
          let coords = mark["position"].split(" ");

          let myLatLng = {
            lat: parseFloat(coords[1].replace(")", "")),
            lng: parseFloat(coords[0].replace("POINT(", ""))
          };

          let marker = new this.gmapservice.google.maps.Marker({
            position: myLatLng,
            map: this.gmapservice.gmap,
            mark_title: mark["title"],
            mark_descr: mark["description"],
            mark_id: mark["id"],
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          });

          this.all_markers.push(marker);

          marker.addListener("click", () => {
            this.click_on_marker(marker);
          });
        });
      },
      error => {
        this.modalRef = this.modalService.open(NgbdModalBasic);
        this.modalRef.componentInstance.set_title('Connection error.');
        this.modalRef.componentInstance.set_body('Get Markers error. Please contact support.');
      }
    );
  }

  marker_saved(data: any) {

    this.is_edit_marker = false;
    $("#save_mark_btn").text("Save");

    this.clear_marker_form();

    this.current_marker = undefined;

    this.get_markers();
  }

  save_marker() {
    try {
      this.current_marker["mark_title"] = $("#marker_title").val();
      this.current_marker["mark_descr"] = $("#marker_descr").val();

      if (this.is_edit_marker) {

        this.apiService.edit_marker(this.current_marker).subscribe(
          data => {
            this.marker_saved(data);
          },
          error => {
            console.log("error: ");
            console.log(error);
          }
        );
      } else {

        this.apiService.save_marker(this.current_marker).subscribe(
          data => {
            //this.all_markers.push(this.current_marker)
            this.marker_saved(data);
          },
          error => {
            this.modalRef = this.modalService.open(NgbdModalBasic);
            this.modalRef.componentInstance.set_title('Connection error.');
            this.modalRef.componentInstance.set_body('Save marker error. Please contact support.');
          }
        );
      }
    } catch (err) {}
  }







  //=================================================
  // Modals



  closeResult: string;
  modalRef: any;


  confirm_handler(){

    try {
      if (this.current_marker["mark_id"]) {
        this.apiService.delete_marker(this.current_marker["mark_id"]).subscribe(
          data => {
            this.marker_saved(data);
          },
          error => {
            console.log(error);
          }
        );
      }
      this.modalRef.close();

      try {
        this.current_marker.setMap(null);
      } catch (err) {}

      this.current_marker = null;
      this.clear_marker_form();
      this.is_edit_marker = false;
    } catch (err) {
      console.log("Nothing to delete");
      this.modalRef.close();
    }


  }

  reject_handler(){
    this.modalRef.close();
  }


  openDeleteMarkerModal() {

    this.modalRef = this.modalService.open(NgbdModalBasic);

    this.modalRef.componentInstance.set_title('Delete confirmation');
    this.modalRef.componentInstance.set_body('Do you want to delete this marker?.');

    //------------- My custom events ------------------

    this.modalRef.componentInstance.show_confirm_button = true;
    this.modalRef.componentInstance.confirm_event.subscribe((e) => {
      this.confirm_handler();
    })

    this.modalRef.componentInstance.show_reject_button = true;
    this.modalRef.componentInstance.reject_event.subscribe((e) => {
      this.reject_handler();
    })


    //------------- Default events ---------------------


    this.modalRef.componentInstance.show_close_button = false;

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










}

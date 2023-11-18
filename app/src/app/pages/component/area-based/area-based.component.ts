import { Component, OnInit } from '@angular/core';


import { GmapService } from '../../../services/gmap.service';

import { WebsocketServiceService } from '../../../services/websocket-service.service';
import { RestapiService } from '../../../services/restapi.service';

import { Observable, Subject } from "rxjs/Rx";

import {SelectItem} from 'primeng/primeng'

import * as city_based from './city-based'
import * as zip_based from './zip-based'
import * as sd_based from './sd-based'


import {NgbdModalBasic} from "../modal/modal.component";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-area-based',
  templateUrl: './area-based.component.html',
  styleUrls: ['./area-based.component.scss']
})
export class AreaBasedComponent implements OnInit {

  datasets: any[];
  active_dataset: any;
  prev_field_slider_value:number;


  zillowMin_zip: number;
  zillowMax_zip: number;

  zillowMin_city: number;
  zillowMax_city: number;

  sdMin: number;
  sdMax: number;

  several_metros: any[];


  zillowdatasets_connection: Subject<any>;


  all_cities: any;
  all_cities_markers: any[];

  current_city_marker: any;

  current_lat_lng_string: string;


  infowindow_zip: any;
  infowindow_city: any;
  infowindow_sd: any;

  modalRef: any;



  current_featureID: string;
  featureIDs_to_exclude: any[];

  hide_sdLayer_flag: boolean;
  hide_zipLayer_flag: boolean;



  ngOnInit(){}

  constructor(

    private wsService: WebsocketServiceService,
    private apiService: RestapiService,
    private gmapservice: GmapService,
    private modalService: NgbModal


  ) {



      this.active_dataset = { columns: [""] };

      this.zillowMin_zip = Number.MAX_VALUE;
      this.zillowMax_zip = Number.MIN_VALUE;

      this.zillowMin_city = Number.MAX_VALUE;
      this.zillowMax_city = Number.MIN_VALUE;

      this.sdMin = Number.MAX_VALUE;
      this.sdMin = Number.MIN_VALUE;

      this.datasets = [];

      this.apiService.get_zillow_datasets().subscribe(
        data => {
          this.datasets = data;
          this.active_dataset = this.datasets['zillow.com/data'][0];
          this.active_dataset.isactive = true;
          this.prepare_dataset_fields();
        },
        error => {
          this.modalRef = this.modalService.open(NgbdModalBasic);
          this.modalRef.componentInstance.set_title('Connection error.');
          this.modalRef.componentInstance.set_body('Get datasets error. Please contact support.');
        }
      );

      this.gmapservice.gmap_subject.subscribe(
        data => {
          this.after_gmap_init();
        }
      );


      this.all_cities = {};
      this.all_cities_markers = [];

      this.several_metros = [];


      this.gmapservice.set_metro_tothe_city_event.subscribe((e) =>{
        city_based.update_the_color_of_marker(e, this);
        try{
          this.infowindow_city.setContent(e[1][0].toString());
        }catch(err){}

      })



      //----------------------------------

      this.current_featureID = '';
      this.featureIDs_to_exclude = [];

      this.hide_sdLayer_flag = false;
      this.hide_zipLayer_flag = false;


      this.gmapservice.exclude_featureID_event.subscribe((e) => {

        this.featureIDs_to_exclude.push(this.current_featureID);


        if(this.active_dataset['ds_group'] == 'zillow_city'){
          city_based.redraw_locations(this.active_dataset.city_based_dataset, this);
          this.infowindow_city.close();
        }else if(this.active_dataset['ds_group'] == 'school_district'){
          sd_based.redraw_sd_features(this.active_dataset.sd_based_dataset, this);
          this.infowindow_sd.close();
        }else{
          zip_based.redraw_zip_features(this.active_dataset.zip_based_dataset, this);
          this.infowindow_zip.close();
        }

        $(".detailed_info_content").html('');


      })



  // End of Constructor
  }
  //============================================
  //============================================





  after_gmap_init(){



    zip_based.set_zip_based_layer(this);

    city_based.set_city_based_layer(this);

    sd_based.set_sd_based_layer(this);


    this.wsService.connection.subscribe(data => {

      console.log('data');
      console.log(data);

      if (data['type'] == 'zip'){

        zip_based.draw_zip_based_dataset(data, this);

      }else if(data['type'] == 'school_district'){

        sd_based.draw_sd_based_dataset(data, this);

      }else if(data['type'] == 'city'){

        city_based.draw_city_based_dataset(data, this);

      }

      $(".progress").hide();

      $("#data_load_button").prop("disabled", false);

    });


    this.infowindow_zip = new this.gmapservice.google.maps.InfoWindow({
      map: this.gmapservice.gmap,
    });
    this.infowindow_zip.close();



    this.infowindow_city = new this.gmapservice.google.maps.InfoWindow({
      map: this.gmapservice.gmap,
    });
    this.infowindow_city.close();


    this.infowindow_sd= new this.gmapservice.google.maps.InfoWindow({
      map: this.gmapservice.gmap,
    });
    this.infowindow_sd.close();



  }



  // ======================= ngAfterViewInit() =======================
  ngAfterViewInit() {


  }

  // ===================== END ngAfterViewInit() =====================




  prepare_dataset_fields() {

    for (var property in this.datasets) {
      if (this.datasets.hasOwnProperty(property)) {
        this.datasets[property].forEach(dataset => {
          dataset.columns = dataset.columns.split(",");
          dataset.num_fields = dataset.columns.length - 1;
          dataset.field_slider_value = dataset.num_fields;
          this.prev_field_slider_value = dataset.field_slider_value;
          dataset.dropdown_list = this.prepare_dropdown_list(dataset);
        });
      }
    }


    // this.datasets.forEach(dataset => {
    //   dataset.columns = dataset.columns.split(",");
    //   dataset.num_fields = dataset.columns.length - 1;
    //   dataset.field_slider_value = dataset.num_fields;
    //   dataset.dropdown_list = this.prepare_dropdown_list(dataset);
    // });

  }



  prepare_dropdown_list(dataset){

    let temp: SelectItem[];

    temp = new Array<SelectItem>();

    dataset.columns.forEach((element, index) => {
      temp.push( { label:element, value:index } )
    });


  return temp;


  }






  dataset_slider_changed(event:any){

    this.gmapservice.set_morethanone_metro_event.emit({'flag': false, 'data': []});

    $(".detailed_info_content").html('');

    if(event.value != this.prev_field_slider_value){

      this.prev_field_slider_value = event.value;

      if(this.active_dataset['ds_group'] == 'zillow_city'){

        city_based.redraw_locations(this.active_dataset.city_based_dataset, this);

      }else if(this.active_dataset['ds_group'] == 'school_district'){

        sd_based.redraw_sd_features(this.active_dataset.sd_based_dataset, this);

      }else{

        zip_based.redraw_zip_features(this.active_dataset.zip_based_dataset, this);

      }

    }

  }





  activate_dataset(dataset: any) {


    $(".detailed_info_content").html('');

    this.active_dataset.isactive = false;
    this.active_dataset = dataset;
    this.active_dataset.isactive = true;

    if (this.active_dataset['ds_group'] == 'zillow_city'){

      city_based.activate_citybased_dataset(this);

    }else if(this.active_dataset['ds_group'] == 'school_district'){

      sd_based.activate_sdbased_dataset(this);

    }else{

      zip_based.activate_zipbased_dataset(this);

    }

  }




  toggle_dataset(){

    if(this.active_dataset['ds_group'] == 'zillow_city'){

      city_based.toggle_dataset(this);

    }else if(this.active_dataset['ds_group'] == 'school_district'){

      sd_based.toggle_dataset(this);

    }else{

      zip_based.toggle_dataset(this);

    }

  }



  getDatasets(json_coords:any, type) {


    this.wsService.connection.next({
      type: type,
      json_coords: json_coords,
      table_name: this.active_dataset["table_name"],
      field_name: this.active_dataset["columns"][
        this.active_dataset["field_slider_value"]
      ]
    });

  }



  load_dataset() {

    $(".detailed_info_content").html('');

    $("#data_load_button").prop("disabled", true);

    $(".progress").show();
    $("#toggle_dataset").prop("checked", false);
    document.getElementById("zillow-min").textContent = "min";
    document.getElementById("zillow-max").textContent = "max";


    let json_coords = {
      top_left: [
        this.gmapservice.gmap
          .getBounds()
          .getSouthWest()
          .lat(),
        this.gmapservice.gmap
          .getBounds()
          .getSouthWest()
          .lng()
      ],
      bottom_right: [
        this.gmapservice.gmap
          .getBounds()
          .getNorthEast()
          .lat(),
        this.gmapservice.gmap
          .getBounds()
          .getNorthEast()
          .lng()
      ]
    };

    json_coords['top_left'][0] -= 0.03 ;
    json_coords['top_left'][1] -= 0.03 ;

    json_coords['bottom_right'][0] += 0.03 ;
    json_coords['bottom_right'][1] += 0.03 ;

    console.log('active_dataset');
    console.log(this.active_dataset);

    if (this.active_dataset['ds_group'] == 'zillow_city'){
      this.getDatasets(json_coords, 'city');
    }else if(this.active_dataset['ds_group'] == 'school_district'){

      this.getDatasets(json_coords, 'school_district');
    }else{
      this.getDatasets(json_coords, 'zip');
    }

  }


  //==================================================

  set_more_than_one_metro(data:any){

    this.gmapservice.set_morethanone_metro_event.emit(data);

  }



  //==================================================
  //==================================================



  ngOnDestroy(){
  }



  generateArray(obj){
    return Object.keys(obj).map((key)=>{ return obj[key]});
  }



}


// https://developers.google.com/maps/documentation/javascript/examples/layer-data-dynamic

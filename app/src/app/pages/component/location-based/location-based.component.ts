import { Component, OnInit } from '@angular/core';


import { GmapService } from '../../../services/gmap.service';

import { WebsocketServiceService } from '../../../services/websocket-service.service';
import { RestapiService } from '../../../services/restapi.service';


import { Observable, Subject } from "rxjs/Rx";
import { element } from 'protractor';
import { concat } from 'rxjs/operators/concat';

@Component({
  selector: 'app-location-based',
  templateUrl: './location-based.component.html',
  styleUrls: ['./location-based.component.scss']
})
export class LocationBasedComponent implements OnInit {


  datasets: any;

  datasets_list_to_load: any[];

  dataset_columns: any;

  all_locations: any[];

  infowindow: any;
  //infowindow_content: any;


  ngOnInit() {}

  constructor(

    private wsService: WebsocketServiceService,
    private apiService: RestapiService,
    private gmapservice: GmapService

  ) {

    this.datasets = {};

    this.dataset_columns = {};

    this.all_locations = [];
    this.datasets_list_to_load = [];



    this.apiService.get_locationbased_datasets().subscribe(
      data => {


        this.datasets = data;
        console.log(this.datasets);


        this.datasets['all'].forEach(element => {
          this.dataset_columns[element['table_name']] = element['columns'].split(',');
        });

        console.log(this.dataset_columns);

      },
      error => {}
    );

    //-----------------------------

    this.gmapservice.gmap_subject.subscribe(
      data => {
        this.after_gmap_init();
      }
    );

    //-----------------------------



  }



  //============================================
  //============================================

  get_public_schools_content(element){

    return 'public_schools_content'
  }




  //============================================


  html_from_cols(columns:any, element:any){

    let html = ''

    columns.forEach(col=>{
      html += '<b><b>' + col + '</b></b>' + ': ' + element[col] + ' <br> ';
    });

    return html;


  }

  draw_location(element:any, icon:any, columns:any[]){


    let coords = JSON.parse(element['ST_AsGeoJSON(POSITION)']);

    let myLatLng = {
      lat: coords['coordinates'][1],
      lng: coords['coordinates'][0]
    };

    let marker = new this.gmapservice.google.maps.Marker({
      position: myLatLng,
      map: this.gmapservice.gmap,
      icon: icon
    });

    //-------------------------

    marker.addListener('mouseover', () => {

      this.infowindow.open(this.gmapservice , marker);

      let html = this.html_from_cols(columns, element);


      this.infowindow.setContent(html);

    });


    //-------------------------

    // assuming you also want to hide the infowindow when user mouses-out
    marker.addListener('mouseout', () => {
      this.infowindow.close();
    });



    //-------------------------


    marker.addListener("click", () => {

      this.gmapservice.set_morethanone_metro_event.emit({'flag': false, 'data': []});

      let html = this.html_from_cols(columns, element);

      $(".detailed_info_content").html(html);

    });


    //-------------------------

    this.all_locations.push(marker);


  }



  get_icon(url, size){

    // "http://34.192.117.11/assets/images/building.png"
    var icon = {
      url: url,
      scaledSize : new this.gmapservice.google.maps.Size(size[0], size[1])
    }

    return icon;

  }


  //=============================================
  //=============================================
  //=============================================


  after_gmap_init(){

    this.set_location_based_layer();


    this.wsService.connection.subscribe(data => {

      if (data['type'] == 'location'){


        for (var prop in data['data']){

          let table_name = Object.keys(data['data'][prop])[0];

          let url = '';
          let icon_size = [];

          //console.log(table_name);

          if(table_name == 'Public_Schools'){

            url = "/assets/images/public_schools.png";
            icon_size = [30, 30];

          }else if(table_name == 'Private_Schools'){

            url = "/assets/images/private_schools.png";
            icon_size = [30, 30];

          }else if(table_name == 'Colleges_and_Universities'){

            url = "/assets/images/Science-University-icon.png";
            icon_size = [30, 30];

          }else if(table_name == 'Supplemental_Colleges'){

            url = "/assets/images/supplemental_colleges.png";
            icon_size = [60, 60];

          }else if(table_name == 'Grocery_Stores'){

            url = "/assets/images/store-grocery.png";
            icon_size = [30, 30];

          }else if(table_name == 'Fortune_500_Companies'){

            url = "/assets/images/Fortune_500.png";
            icon_size = [50, 50];

          }


          let icon = this.get_icon(url, icon_size)



          //----------------------------------------------
          // Prepare fields


          this.datasets['all'].forEach(dataset => {


            if (dataset['table_name'] == table_name){
              dataset['dataset'] = data['data'][prop][table_name]
            }

          });

          //----------------------------------------------


          //==================
          // draw_location
          //==================

          let columns = this.dataset_columns[table_name]

          data['data'][prop][table_name].forEach(element => {
            this.draw_location(element, icon, columns);
          });

          //==================
          //==================



        }
        //console.log(this.datasets);


        $(".progress").hide();

        $("#otherdata_load_button").prop("disabled", false);


      }


    })


    //--------------------------------------------------


    this.infowindow = new this.gmapservice.google.maps.InfoWindow({
      map: this.gmapservice.gmap,
    });
    this.infowindow.close();



    //--------------------------------------------------




  }


  //============ END after_gmap_init() ==========
  //=============================================
  //=============================================



  set_location_based_layer(){

    console.log('set_location_based_layer()');

  }



  //=============================================


  load_dataset(){


    $(".progress").show();

    $("#otherdata_load_button").prop("disabled", true);

    $(".detailed_info_content").html('');



    //-------------------------------------

    // this.otherdatasets.forEach(dataset => {
    //   console.log(dataset.isactive);
    // });


    //-------------------------------------

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


    // json_coords['top_left'][0] -= 0.03 ;
    // json_coords['top_left'][1] -= 0.03 ;

    // json_coords['bottom_right'][0] += 0.03 ;
    // json_coords['bottom_right'][1] += 0.03 ;

    console.log('load_dataset');


    this.clear_datasets();



    this.wsService.connection.next({

      type: 'location',
      json_coords: json_coords,
      table_name: this.datasets_list_to_load

    });


  }


  //-----------------------------------------------

  clear_datasets(){
    console.log('clear_otherdatasets()');


    this.all_locations.forEach(marker => {
      marker.setMap(null);
    });

    console.log(this.datasets);

  }


  //------------------------------------------------

  toggle_dataset(dataset:any){

    $(".detailed_info_content").html('');

    if(dataset.isactive){
      dataset.isactive = false;

      let ind = this.datasets_list_to_load.indexOf(dataset['table_name']);
      this.datasets_list_to_load.splice(ind,1);


    }else{
      dataset.isactive = true;
      this.datasets_list_to_load.push(dataset['table_name'])

    }

    // this.otherdatasets.forEach(dataset=>{
    //   console.log(dataset);
    // })

  }



  ngOnDestroy() {

  }

}







import { Injectable, EventEmitter } from '@angular/core';

import GoogleMapsLoader from "google-maps";
import { google } from "google-maps";
declare let google: any;

import { Observable, Subject } from 'rxjs';

@Injectable()
export class GmapService {

  public gmap: any;
  public google: any;

  public zipLayer: any;
  public cityLayer: any;
  public sdLayer: any;

  public gmap_subject:  Subject<any>;

  public min_zoom_value: number;

  public more_that_one_metro: boolean;

  //------------------------

  public set_morethanone_metro_event = new EventEmitter<any>();

  public set_metro_tothe_city_event = new EventEmitter<any>();

  public exclude_featureID_event = new EventEmitter<any>();


  //------------------------

  constructor() {

    this.gmap_subject = new Subject();

    this.min_zoom_value = 9;

    this.more_that_one_metro = false;


  }


  //===========================================

  check_screen_size(){


    let is_fit = true;



    let json_coords = {
      left: this.gmap.getBounds().getSouthWest().lng(),
      right: this.gmap.getBounds().getNorthEast().lng()
    };

    let w = json_coords.right - json_coords.left;


    if(w <= 6) {
      return true;
    }else{
      return false;
    }


    // address_components.forEach(element => {
    //   try{

    //     if (element['types'].includes('postal_code')){
    //       zoom =  12;
    //     }
    //   }catch(err){

    //   }
    // });


        //---------- Comments -----------
    // google.maps.event.addListener(this.gmap, "zoom_changed", () => {
    //   if (this.gmap.getZoom() >= 8) {
    //     this.displayZips();
    //   } else {
    //     this.zillowMin = Number.MAX_VALUE;
    //     this.zillowMax = Number.MIN_VALUE;
    //     document.getElementById("zillow-min").textContent = "min";
    //     document.getElementById("zillow-max").textContent = "max";

    //     this.gmap.data.forEach(feature => {
    //       this.gmap.data.remove(feature);
    //     });
    //   }
    // });


    // https://developers.google.com/maps/documentation/javascript/layers
    // https://developers.google.com/maps/documentation/javascript/datalayer



  }



  setup_google_maps_listeners(){


    this.google.maps.event.addListener(this.gmap, "zoom_changed", () => {

      if (this.check_screen_size()) {

        $(".load_dataset").prop("disabled", false);

      } else {

        $(".load_dataset").prop("disabled", true);

      }
    });


  }





  load_gmap(el:any, lat:number, lng:number, zoom:number): Observable<any>{


    let observable = new Observable(observer => {
      GoogleMapsLoader.KEY = "AIzaSyDIC6vAtoauDaeoSKbwYD9UUZXfYArI8k0";

      GoogleMapsLoader.load(google => {

        this.gmap = new google.maps.Map(el, {
          center: new google.maps.LatLng(lat, lng),
          zoom: zoom
        });

        this.google = google;

        this.zipLayer = new this.google.maps.Data({map:this.gmap});
        this.cityLayer = new this.google.maps.Data({map:this.gmap});
        this.sdLayer = new this.google.maps.Data({map:this.gmap});

        observer.next('gmap&google has been loaded');

        this.setup_google_maps_listeners();

      });

    })

    return observable;



  }

}

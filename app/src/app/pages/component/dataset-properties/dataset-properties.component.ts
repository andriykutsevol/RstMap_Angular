import { Component, OnInit } from '@angular/core';

import { GmapService } from '../../../services/gmap.service';

import { WebsocketServiceService } from '../../../services/websocket-service.service';
import { RestapiService } from '../../../services/restapi.service';


@Component({
  selector: 'app-dataset-properties',
  templateUrl: './dataset-properties.component.html',
  styleUrls: ['./dataset-properties.component.scss']
})
export class DatasetPropertiesComponent implements OnInit {


  public more_that_one_metro: boolean
  public metros: any;

  public current_active_metro: any;


  constructor(

    private wsService: WebsocketServiceService,
    private apiService: RestapiService,
    private gmapservice: GmapService

  ) {

    this.more_that_one_metro = false;
    this.metros = []

    this.gmapservice.gmap_subject.subscribe(
      data => {
        this.setup_listeners();
      }
    );


    this.gmapservice.set_morethanone_metro_event.subscribe((data) => {

      if(data['flag']){
        this.more_that_one_metro = true;
      }else{
        this.more_that_one_metro = false;
      }

      try{

        this.metros = data['data'];
        this.current_active_metro = this.metros[0];

        $(".detailed_info_content").html(this.get_current_active_metro_html(this.current_active_metro));

      }catch(err){}


    })

  }


  setup_listeners(){}


  exclude_current_featureID(){
    console.log('exclude_current_featureID()');
    this.gmapservice.exclude_featureID_event.emit({});
  }


  display_zip_areas_info(vals:any[]){

  }

  set_metro_tothe_city(metro){

    this.current_active_metro[1][1] = false;
    this.current_active_metro = metro;
    this.current_active_metro[1][1] = true;

    this.gmapservice.set_metro_tothe_city_event.emit(metro);

    $(".detailed_info_content").html(this.get_current_active_metro_html(this.current_active_metro));

  }



  get_current_active_metro_html(current_active_metro:any){

    let html = '<b><b>' + this.current_active_metro[1][3][0] + '</b></b>: &nbsp;' + this.current_active_metro[1][3][1] + "<br>"

    html += '<b><b>' + this.current_active_metro[1][4][0] + '</b></b>: &nbsp;' + this.current_active_metro[1][4][1] + "<br>"

    html += '<b><b>' + this.current_active_metro[1][2][0] + '</b></b>: &nbsp;' + this.current_active_metro[1][2][1] + "<br>"


    return html;

  }


  ngOnInit() {
  }

}

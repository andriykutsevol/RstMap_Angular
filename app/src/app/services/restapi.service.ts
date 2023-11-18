import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { AppConfig } from '../../app.config';



@Injectable()
export class RestapiService {

  constructor(
    public http: HttpClient,
    private appConfig: AppConfig
  ) {}



  toHttpParams(params) {
    return Object.getOwnPropertyNames(params)
                 .reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }


  save_marker(marker:any){

    // //let headers = new HttpHeaders({"Content-Type": "application/json", "Authorization": "JWT " + machine.token});
    //let headers = new HttpHeaders({"Content-Type": "application/json"});
    let url = this.appConfig.apiUrl + '/save_marker/';
    // let params = new HttpParams();
    // // params = this.toHttpParams({asdf: 'asdf', qwer: 'qwer'});
    let payload = {"title": marker['mark_title'], "descr": marker['mark_descr'], "lat": marker.position.lat(), "lng": marker.position.lng()}

    return this.http.post(url, payload ,{headers: this.jwt()});

  }



  edit_marker(marker:any){

    // //let headers = new HttpHeaders({"Content-Type": "application/json", "Authorization": "JWT " + machine.token});

    //let headers = new HttpHeaders({"Content-Type": "application/json"});
    let url = this.appConfig.apiUrl + '/edit_marker/';

    let payload = {"mark_id": marker['mark_id'], "title": marker['mark_title'], "descr": marker['mark_descr']}

    return this.http.post(url, payload ,{headers: this.jwt()});

  }


  get_markers(){

    //let headers = new HttpHeaders({"Content-Type": "application/json"});
    let url = this.appConfig.apiUrl + '/get_markers';

    let params = new HttpParams();
    // params = this.toHttpParams({asdf: 'asdf', qwer: 'qwer'});

    return this.http.get<any[]>(url, {params: params, headers: this.jwt()});

  }



  delete_marker(mark_id){

    //let headers = new HttpHeaders({"Content-Type": "application/json"});
    let url = this.appConfig.apiUrl + '/delete_marker';

    //let params = new HttpParams();
    let params = this.toHttpParams({"mark_id": mark_id});

    return this.http.get(url, {params: params, headers: this.jwt()});

  }


  // For the first tab.
  get_zillow_datasets(){

    //let headers = new HttpHeaders({"Content-Type": "application/json"});
    let url = this.appConfig.apiUrl + '/get_zillow_datasets';

    let params = new HttpParams();
    //let params = this.toHttpParams({"mark_id": mark_id});

    return this.http.get<any[]>(url, {params: params, headers: this.jwt()});

  }


  // For the second tab.
  get_locationbased_datasets(){

      let url = this.appConfig.apiUrl + '/get_locationbased_datasets';

      let params = new HttpParams();

      return this.http.get<any[]>(url, {params: params, headers: this.jwt()});

  }



  private jwt() {
    // create authorization header with jwt token
    let access_token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({"Content-Type": "application/json", 'Authorization': 'Bearer ' + access_token});
    return headers
  }



}

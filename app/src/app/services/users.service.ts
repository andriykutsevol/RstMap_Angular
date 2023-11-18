import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { AppConfig } from '../../app.config';

import {  Router, ActivatedRoute  } from '@angular/router';

@Injectable()
export class UsersService {

  constructor(
    public http: HttpClient,
    private appConfig: AppConfig
  ) { }



  onsignup(values: any){

    // console.log('onsignup');
    // console.log(values.username);
    // console.log(values.passwords.password);

    console.log(values);

    let url = this.appConfig.apiUrl + '/signup';

    let headers = new HttpHeaders({"Content-Type": "application/json"});

    return this.http.post(url, values ,{headers: headers});

  }


  onlogin(values: any){

        let url = this.appConfig.apiUrl + '/login';

        let headers = new HttpHeaders({"Content-Type": "application/json"});
        let payload = {"username": values.username, "password": values.password};

        return this.http.post(url, payload ,{headers: headers});

  }



  onlogin_with_google(values:any){

    let url = this.appConfig.apiUrl + '/login_with_google';

    let headers = new HttpHeaders({"Content-Type": "application/json"});
    let payload = {"username": values.username, "token": values.token};

    return this.http.post(url, payload ,{headers: headers});

  }




  logout() {
    console.log('logout');
    localStorage.removeItem('identity');
    localStorage.removeItem('access_token');
  }



  toHttpParams(params) {
    return Object.getOwnPropertyNames(params)
                 .reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }



  private jwt() {
    // create authorization header with jwt token
    let access_token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({"Content-Type": "application/json", 'Authorization': 'Bearer ' + access_token});
    return headers
  }



  change_pwd(values:any){

    //let headers = new HttpHeaders({"Content-Type": "application/json"});
    let url = this.appConfig.apiUrl + '/change_pwd';

    let params = new HttpParams();
    params = this.toHttpParams({"old_pwd": values['old_pwd'], "new_pwd": values['passwords']['new_pwd']});

    return this.http.get<any>(url, {params: params, headers: this.jwt()});

  }



  send_pwd(values:any){

    let url = this.appConfig.apiUrl + '/send_pwd';

    let params = new HttpParams();
    params = this.toHttpParams({"email": values['email']});

    return this.http.get<any>(url, {params: params});

  }



  change_email(values:any){

    //let headers = new HttpHeaders({"Content-Type": "application/json"});
    let url = this.appConfig.apiUrl + '/change_email';

    let params = new HttpParams();
    params = this.toHttpParams({"email_pwd": values['email_pwd'], "new_email": values['emails']['new_email']});

    return this.http.get<any>(url, {params: params, headers: this.jwt()});

  }




}

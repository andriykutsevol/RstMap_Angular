import { Component, OnInit, EventEmitter, NgZone  } from '@angular/core';

import { NgClass } from '@angular/common';

import { UsersService } from '../services/users.service';

import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
// import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../validators';

import {  Router, ActivatedRoute  } from '@angular/router';

// npm install jsonwebtoken
declare var require: any
const jsonwebtoken: any = require('jsonwebtoken');

declare const gapi: any;



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  public loginform:FormGroup;
  public fpwdform:FormGroup;

  public pwdmismatch: boolean;

  public show_forgot_pwd: boolean;
  public rec_txt: string;
  public pwdsended_msg: string;

  username: AbstractControl;
  email: AbstractControl;

  passwords:FormGroup;
  password: AbstractControl;


  repeatPassword: AbstractControl;

  returnUrl: string;

  public login_success_event = new EventEmitter<any>();

  public pwd_mismatch_event = new EventEmitter<any>();

  constructor(
    private fb:FormBuilder,
    private userservice: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private _ngZone: NgZone
  ) {
    console.log("LoginComponent");

    this.pwdmismatch = false;

    this.show_forgot_pwd = false;
    this.rec_txt = "Forgot Password?";
    this.pwdsended_msg = '';

    this.loginform = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]

    });

    this.username = this.loginform.controls['username'];
    this.password = this.loginform.controls['password'];



    this.fpwdform = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.email = this.fpwdform.controls['email'];


  }

  to_recover(){
    console.log('to_recover()');

    if (this.show_forgot_pwd){
      this.show_forgot_pwd = false;
      this.rec_txt = "Forgot Password?";
    }else{
      this.show_forgot_pwd = true;
      this.rec_txt = "Back to login";
    }

  }



  on_pwd_send(values:any){


    this.userservice.send_pwd(values).subscribe(
      data => {
        this.pwdsended_msg = data['message'];

        console.log('data_status: ' + data['status']);

        if(data['status'] == 'ok'){
          $('#pwdsended_msg').removeClass('red');
          $('#pwdsended_msg').addClass('green');
        }else if(data['status'] == 'error'){
          $('#pwdsended_msg').removeClass('green');
          $('#pwdsended_msg').addClass('red');
        }

      },
      error => {
        this.pwdmismatch = true;
        $('#pwdsended_msg').addClass('red');
      }
    )

  }

  login_succesfull(data:any){
    $(".preloader").fadeOut();

    let jwt_decoded = jsonwebtoken.decode(data['access_token'])

    localStorage.setItem('identity', jwt_decoded['identity'] );
    localStorage.setItem('access_token', data['access_token'] );

    // It is important to redirect to the '/' route,
    // due to the initializations.
    //this.router.navigate(['/']);

    // We could do the following
    window.location.href = '/';
    // but I use NgZone:
    // this._ngZone.run(()=>{this.login_succesfull(data);});





  }


  onlogin(values:any){

    this.userservice.onlogin(values).subscribe(
      data => {

        this.login_succesfull(data);

      },
      error => {

        this.pwdmismatch = true;

      }
    )


  }


  public auth2: any;

  public googleInit(login_component:any) {
    let that = this;

    try{
        gapi.load('auth2', function () {
          // client secret: yx01UZkAMHgnRJQFbD2sFmcO
          that.auth2 = gapi.auth2.init({
            client_id: '458526059458-hv1liro3hvd5p7ummisekffmkk64sj8h.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
          });
          that.attachSignin(document.getElementById('googleBtn'), login_component);

        });
      }catch(err){
        // The issue from Google :)
        // https://github.com/google/google-api-javascript-client/issues/260
        // alert(err);
        // alert('It looks like you have an "block third-party cookies and site data" option enabled in your browser')
      }


  }


  public attachSignin(element:any, login_component:any) {
    let that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {

        let profile = googleUser.getBasicProfile();
        // console.log('Token || ' + googleUser.getAuthResponse().id_token);
        // console.log('ID: ' + profile.getId());
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE

        login_component.userservice.onlogin_with_google({
          'username': profile.getEmail(),
          'token': googleUser.getAuthResponse().id_token
        }).subscribe(

          data => {

            login_component.login_success_event.emit(data);

          },

          error => {
            login_component.pwd_mismatch_event.next('pwd_mismatch');
            login_component.pwdmismatch = true;

          }

        )


      }, function (error) {
        //alert(JSON.stringify(error, undefined, 2));
      });
  }






  //--------------------------------------------



  ngOnInit() {

    this.userservice.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  ngAfterViewInit() {
    $(function() {
        $(".preloader").fadeOut();
    });
    // $(function() {
    //     (<any>$('[data-toggle="tooltip"]')).tooltip()
    // });
    // $('#to-recover').on("click", function() {
    //     $("#loginform").slideUp();
    //     $("#recoverform").fadeIn();
    // });

    this.googleInit(this);

    this.login_success_event.subscribe(data => {
      this._ngZone.run(()=>{
        this.login_succesfull(data);
      });
    });

    this.pwd_mismatch_event.subscribe(data =>{
      console.log('this.pwdmismatch');
      // this.pwdmismatch = true;  // This does not work outside of angular;
      // $('#manually_pwdmismatch').removeClass('hidden');
      this._ngZone.run(()=>{this.pwdmismatch = true;});
    })

  }

}

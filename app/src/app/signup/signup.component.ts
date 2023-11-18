import { Component, OnInit } from '@angular/core';


import { UsersService } from '../services/users.service';

import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
// import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../validators';

import { Router } from '@angular/router';
//import { EmailValidator } from '../validators/email.validator';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  public signupform:FormGroup;

  public userexists: boolean;
  public emailexists: boolean;

  username: AbstractControl;
  //email: AbstractControl;

  signed_up: boolean;

  passwords:FormGroup;
  password: AbstractControl;
  repeatPassword: AbstractControl;

  constructor(
    private fb:FormBuilder,
    private userservice: UsersService,
    private router: Router
  ) {
    console.log("SignupComponent");

    this.userexists = false;
    this.emailexists = false;

    this.signed_up = false;


    this.signupform = fb.group({
      //'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'username': ['', Validators.compose([Validators.required, Validators.email])], // EmailValidator.validate(this.email)
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})

    })

    this.username = this.signupform.controls['username'];
    //this.email = this.signupform.controls['email'];

    this.passwords = <FormGroup> this.signupform.controls['passwords'];

    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];


  }

  onsignup(values:any){

    // console.log(values);

    $('#signup_spinner').removeClass('hidden');
    $('#signup_spinner').addClass('fa-spin');

    this.userexists = false;
    this.emailexists = false;

    if (this.signupform.valid) {
      console.log('this.signupform.valid');
      this.userservice.onsignup(values).subscribe(
        data => {

          if(data['signup'] == 'exists'){

            this.userexists = true;

          }else if(data['signup'] == 'emailexists'){

            this.emailexists = true;

          }else if(data['signup'] == 'ok'){
            this.userexists = false;
            //this.router.navigate(['/login']);
            this.signed_up = true;

          }

          $('#signup_spinner').addClass('hidden');
          $('#signup_spinner').removeClass('fa-spin');

        },
        error => {

          console.log('ERROR: Server Side Error.')

        }
      )
    }

  }



  ngOnInit() { }

  ngAfterViewInit() {
    $(function() {
        $(".preloader").fadeOut();
    });


    $('#signup_spinner').addClass('hidden');
    $('#signup_spinner').removeClass('fa-spin');

    // $(function() {
    //     (<any>$('[data-toggle="tooltip"]')).tooltip()
    // });
    // $('#to-recover').on("click", function() {
    //     $("#loginform").slideUp();
    //     $("#recoverform").fadeIn();
    // });
  }

}

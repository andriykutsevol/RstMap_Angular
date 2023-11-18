import { Component, OnInit } from '@angular/core';

import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { EqualPasswordsValidator } from '../../validators/equalPasswords.validator';
import { UsersService } from '../../services/users.service';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})


export class UserProfileComponent implements OnInit {

  public ch_pwd_form:FormGroup;
  old_pwd: AbstractControl;

  passwords:FormGroup;
  new_pwd: AbstractControl;
  rep_pwd: AbstractControl;

  public user_pwd_change_msg: string;


  // public ch_email_form:FormGroup;
  // email_pwd: AbstractControl;

  // old_email: AbstractControl;

  // emails:FormGroup;
  // new_email: AbstractControl;
  // rep_email: AbstractControl;




  //----------- Start of the constructor --------------

  constructor(
    private fb:FormBuilder,
    private userservice: UsersService
  ) {

    this.user_pwd_change_msg = '';


    //--------------------------------------------

    this.ch_pwd_form = fb.group({
      'old_pwd': ['', Validators.compose([Validators.required])],

      'passwords': fb.group({
        'new_pwd': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'rep_pwd': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('new_pwd', 'rep_pwd')})

    })

    this.old_pwd = this.ch_pwd_form.controls['old_pwd'];

    this.passwords = <FormGroup> this.ch_pwd_form.controls['passwords'];

    this.new_pwd = this.passwords.controls['new_pwd'];
    this.rep_pwd = this.passwords.controls['rep_pwd'];


    //--------------------------------------------

    // this.ch_email_form = fb.group({

    //   'email_pwd': ['', Validators.compose([Validators.required])],

    //   'emails': fb.group({
    //     'new_email': ['', Validators.compose([Validators.required, Validators.email])],
    //     'rep_email': ['', Validators.compose([Validators.required, Validators.email])]
    //   }, {validator: EqualPasswordsValidator.validate('new_email', 'rep_email')})

    // })

    // this.email_pwd = this.ch_email_form.controls['email_pwd'];



    // this.emails = <FormGroup> this.ch_email_form.controls['emails'];

    // this.new_email = this.emails.controls['new_email'];

    // this.rep_email = this.emails.controls['rep_email'];



  }

  //----------- End of the constructor --------------


  //------------------------

  onchange_pwd(values:any){

    console.log(values);

    this.userservice.change_pwd(values).subscribe(
      data => {

        this.user_pwd_change_msg = data['message'];

        if(data['status'] == 'ok'){
          $('#user_pwd_change_msg').removeClass('red');
          $('#user_pwd_change_msg').addClass('green');
        }else if(data['status'] = 'error'){
          $('#user_pwd_change_msg').removeClass('green');
          $('#user_pwd_change_msg').addClass('red');
        }

      },
      error => {
        console.log('Server side error');

      }
    )


    this.ch_pwd_form.reset();
  }

  //------------------------

  // onchange_email(values:any){
  //   console.log(values);

  //   this.userservice.change_email(values).subscribe(
  //     data => {

  //       console.log(data);

  //     },
  //     error => {
  //       console.log('Server side error');
  //     }
  //   )



  //   this.ch_email_form.reset();
  // }

  //------------------------

  // -------------------------------------------------
  ngOnInit() {
  }
  // -------------------------------------------------

}

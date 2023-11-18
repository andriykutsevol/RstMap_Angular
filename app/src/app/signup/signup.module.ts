import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';


import { FormsModule,ReactiveFormsModule }   from '@angular/forms';

// FormsModule gives us template driven directives such as:

// • ngModel and
// • NgForm

// Whereas ReactiveFormsModule gives us directives like

// • formControl and
// • ngFormGroup



@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SignupComponent]
})
export class SignupModule { }

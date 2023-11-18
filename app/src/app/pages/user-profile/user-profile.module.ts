import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';

import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';


const routes: Routes = [{
	path: '',
	// data: {
  //       title: 'title',
  //       urls: [{title: 'Dashboard',url: '/'},{title: 'title'}]
  //   },
	component: UserProfileComponent
}];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [UserProfileComponent]
})
export class UserProfileModule { }

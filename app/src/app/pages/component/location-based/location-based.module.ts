import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationBasedComponent } from './location-based.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LocationBasedComponent],
  exports: [LocationBasedComponent]
})
export class LocationBasedModule { }

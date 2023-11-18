import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaBasedComponent } from './area-based.component';

import {SliderModule} from 'primeng/primeng';
import {ListboxModule} from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';

import {DropdownModule} from 'primeng/primeng';


import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    ListboxModule,
    CheckboxModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [AreaBasedComponent],
  exports: [AreaBasedComponent]
})
export class AreaBasedModule { }

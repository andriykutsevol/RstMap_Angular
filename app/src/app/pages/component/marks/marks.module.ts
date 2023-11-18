import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarksComponent } from './marks.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MarksComponent],
  exports: [MarksComponent]
})
export class MarksModule { }

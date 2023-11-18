import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetPropertiesComponent } from './dataset-properties.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DatasetPropertiesComponent],
  exports: [DatasetPropertiesComponent]
})
export class DatasetPropertiesModule { }

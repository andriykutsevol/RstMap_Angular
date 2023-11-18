import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { ZillowGmapComponent } from './zillow-gmap.component';

// import {SliderModule} from 'primeng/primeng';
// import {ListboxModule} from 'primeng/primeng';
// import {CheckboxModule} from 'primeng/primeng';

// import {DropdownModule} from 'primeng/primeng';

import { FormsModule } from '@angular/forms';

import { AreaBasedModule } from '../component/area-based/area-based.module';
import { LocationBasedModule } from '../component/location-based/location-based.module';
import { DatasetPropertiesModule } from '../component/dataset-properties/dataset-properties.module';
import { MarksModule } from '../component/marks/marks.module';






const routes: Routes = [{
	path: '',
	data: {
        title: 'Zillow GMap',
        urls: [{title: 'Dashboard',url: '/'},{title: 'Zillow GMap'}]
    },
	component: ZillowGmapComponent
}];


@NgModule({
  imports: [
    // ListboxModule,
    // SliderModule,
    // CheckboxModule,
    CommonModule,
    RouterModule.forChild(routes),
    // FormsModule,
    AreaBasedModule,
    LocationBasedModule,
    DatasetPropertiesModule,
    MarksModule
  ],
  declarations: [
    ZillowGmapComponent
  ]
})
export class ZillowGmapModule { }

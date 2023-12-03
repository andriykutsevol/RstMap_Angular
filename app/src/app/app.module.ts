
//import { BrowserModule } from '@angular/platform-browser';
import * as $ from 'jquery';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { WebsocketServiceService } from './services/websocket-service.service';
import { RestapiService } from './services/restapi.service';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { UsersService } from './services/users.service';
import { NavigationService } from './services/navigation.service';
import { GmapService } from './services/gmap.service';


import {ModalModule} from './pages/component/modal/modal.module';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    //HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule
  ],
  exports:[
    ModalModule
  ],
  providers: [
    UsersService,
    HttpClientModule,
    AppConfig,
    AuthGuard,
    WebsocketServiceService,
    RestapiService,
    NavigationService,
    GmapService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

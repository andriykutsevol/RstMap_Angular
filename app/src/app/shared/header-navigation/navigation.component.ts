import { Component, AfterViewInit } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { UsersService } from '../../services/users.service';
import { NavigationService } from '../../services/navigation.service';


import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';


@Component({
  selector: 'ap-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})


export class NavigationComponent implements AfterViewInit {
	  name:string;
  	showHide:boolean;

  	constructor(
      private userservice: UsersService,
      private navigationservice: NavigationService,
      public http: HttpClient
    ) {
      this.showHide = true;

      this.name = localStorage.getItem('identity');



    }




    appsearch(search_type:any, param:any){


      // https://maps.googleapis.com/maps/api/geocode/outputFormat?parameters
      // https://maps.googleapis.com/maps/api/geocode/json?parameters
      // key: AIzaSyDIC6vAtoauDaeoSKbwYD9UUZXfYArI8k0

      // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDIC6vAtoauDaeoSKbwYD9UUZXfYArI8k0

      let params = new HttpParams();
      // params = this.toHttpParams({asdf: 'asdf', qwer: 'qwer'});

      let url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
      //url += encodeURIComponent(param);
      url += param;
      //url += '1600+Amphitheatre+Parkway,+Mountain+View,+CA'
      url += "&key=AIzaSyDIC6vAtoauDaeoSKbwYD9UUZXfYArI8k0"

      this.http.get<any>(url, {params: params}).subscribe(

        data => {

          //console.log(data.results[0].geometry.location);

          this.navigationservice.GoogleGeocodingSubject.next({
            //'latlang': {lat: -28.643387, lng: 153.612224}
            // 'latlng': data.results[0].geometry.location,
            // 'zoom': this.get_zoom(data.results[0].address_components)
            data
          });
        }

      )


    }



    //===========================================

    // logout(){
    //   this.userservice.logout();
    // }


  	changeShowStatus(){
    	this.showHide = !this.showHide;
  	}

    ngAfterViewInit() {

        $(function () {
            $(".preloader").fadeOut();
        });


        var set = function () {
            var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
            var topOffset = 0;
            if (width < 1170) {
                $("body").addClass("mini-sidebar");
                $('.navbar-brand span').hide();
                $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
                $(".sidebartoggler i").addClass("ti-menu");
            } else {
                $("body").removeClass("mini-sidebar");
                $('.navbar-brand span').show();
                //$(".sidebartoggler i").removeClass("ti-menu");
            }

            var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $(".page-wrapper").css("min-height", (height) + "px");
            }

        };
        $(window).ready(set);
        $(window).on("resize", set);

        $(document).on('click', '.mega-dropdown', function (e) {
            e.stopPropagation();
        });

        $(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
            $(".app-search").toggle(200);
        });

        (<any>$('[data-toggle="tooltip"]')).tooltip();

        (<any>$('.scroll-sidebar')).slimScroll({
            position: 'left',
            size: "5px",
            height: '100%',
            color: '#dcdcdc'
        });

        (<any>$('.right-sidebar')).slimScroll({
            height: '100%',
            position: 'right',
            size: "5px",
            color: '#dcdcdc'
        });

        (<any>$('.message-center')).slimScroll({
            position: 'right',
            size: "5px",
            color: '#dcdcdc'
        });

        $("body").trigger("resize");
    }




}

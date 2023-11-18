import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'app-layout',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PageComponent implements OnInit {

    constructor(
      public router: Router,
      private _ngZone: NgZone
    ) { }

    ngOnInit() {
        if (this.router.url === '/') {

            //this.router.navigate(['/gmap']);
            window.location.href = '/#/gmap';

        }
    }

}

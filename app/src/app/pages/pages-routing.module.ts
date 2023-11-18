import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './pages.component';

const routes: Routes = [
    {
        path: '', component: PageComponent,
        children: [
            { path: 'starter', loadChildren: './starter/starter.module#StarterModule' },
            { path: 'user-profile', loadChildren: './user-profile/user-profile.module#UserProfileModule' },
            { path: 'gmap', loadChildren: './zillow-gmap/zillow-gmap.module#ZillowGmapModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }

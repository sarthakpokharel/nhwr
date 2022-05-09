import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MapsComponent } from './maps/maps.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchComponent } from './search/search.component';
import { RegistryComponent } from './registry/registry.component';
import { GroupComponent } from './group/group.component';
import { SubGroupComponent } from './subgroup/subgroup.component';
import { LevelComponent } from './level/level.component';
import { PostComponent } from './post/post.component';
import { DarbandiComponent } from './darbandi/darbandi.component';
import { EmptypeComponent } from './emptype/emptype.component';
import { CouncilComponent } from './council/council.component';
import { TrialComponent } from './trial/trial.component';
import { OfficeComponent } from './office/office.component';
import { ReglistComponent } from './reglist/reglist.component';



const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: '',
        component: AdminLoginComponent
      },
      {
        path: 'map',
        component: MapsComponent
      },
      {
        path: 'registry',
        component: RegistryComponent
      },
      {
        path: 'reglist',
        component: ReglistComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },{
        path: 'admin-login',
        component: AdminLoginComponent
      },
      {
        path: 'group',
        component: GroupComponent
      },
      {
        path: 'subgroup',
        component: SubGroupComponent
      },
      {
        path: 'level',
        component: LevelComponent
      },
      {
        path: 'post',
        component: PostComponent
      },
      {
        path: 'darbandi/:id',
        component: OfficeComponent
      },
      {
        path: 'emptype',
        component: EmptypeComponent
      },
      {
        path: 'council',
        component: CouncilComponent
      },
      {
        path: 'trial',
        component: TrialComponent
      }

    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

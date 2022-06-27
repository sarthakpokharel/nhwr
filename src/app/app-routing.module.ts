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
import { UserRegisterComponent } from './user-register/user-register.component';
import { HealthOfficeComponent } from './health-office/healthoffice.component';
import { AuthGuard, LoginGuard } from './auth.guard';
import { EmplistComponent } from './emplist/emplist.component';
import { EdulevelComponent } from './edulevel/edulevel.component';
import { QualificationComponent } from './qualification/qualification.component';
import { ReportComponent } from './report/report.component';
import { Report2Component } from './report/report2.component';
import { PivotComponent } from './pivot/pivot.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { RegisteredUserListComponent } from './registered-user-list/registered-user-list.component';
import { Trial1Component } from './trial1/trial1.component';



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
        component: RegistryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'reglist',
        component: ReglistComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'emplist',
        component: EmplistComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'search',
        component: SearchComponent
      },{
        path: 'admin-login',
        component: AdminLoginComponent
      },
      {
        path: 'user-register',
        component: UserRegisterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'group',
        component: GroupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'report1',
        component: ReportComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'report2',
        component: Report2Component,
        canActivate: [AuthGuard]
      },
      {
        path: 'pivot',
        component: PivotComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'subgroup',
        component: SubGroupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'level',
        component: LevelComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'qualification',
        component: QualificationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'post',
        component: PostComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'edulevel',
        component: EdulevelComponent,
        canActivate: [AuthGuard]
      },

      {
        path: 'health-office',
        component: HealthOfficeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'darbandi/:id',
        component: OfficeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'emptype',
        component: EmptypeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'council',
        component: CouncilComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'trial',
        component: TrialComponent
      },
      {
        path: 'trial1',
        component: Trial1Component
      },
      {
        path: 'registered-user-list',
        component: RegisteredUserListComponent
      }

    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

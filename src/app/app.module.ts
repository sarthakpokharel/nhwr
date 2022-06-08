import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapsComponent } from './maps/maps.component';
import { SearchComponent } from './search/search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RegistryComponent,AddDetailsComponent } from './registry/registry.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ApiService } from './api.service';
import { LoginService } from './admin-login/login.service';
import { AuthInterceptor } from './auth-interceptor';
import { AuthGuard, LoginGuard } from './auth.guard';
import { GroupComponent } from './group/group.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SubGroupComponent } from './subgroup/subgroup.component';
import { LevelComponent } from './level/level.component';
import { PostComponent } from './post/post.component';
import { DarbandiComponent } from './darbandi/darbandi.component';
import { EmptypeComponent } from './emptype/emptype.component';
import { CouncilComponent } from './council/council.component';
import { TrialComponent } from './trial/trial.component';
import { OfficeComponent, OfficeCrud ,DarbandiCrud,PostCrud} from "./office/office.component";
import { TreeModule } from '@circlon/angular-tree-component';
import { ReglistComponent } from './reglist/reglist.component';
import { EmplistComponent } from './emplist/emplist.component';
import { HealthOfficeComponent } from './health-office/healthoffice.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { RegisteredUserListComponent } from './registered-user-list/registered-user-list.component';
import { EdulevelComponent } from './edulevel/edulevel.component';
import { QualificationComponent } from './qualification/qualification.component';
import { ReportComponent } from './report/report.component';



@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    SearchComponent,
    NavbarComponent,
    HomepageComponent,
    AdminLoginComponent,
    RegistryComponent,
    AddDetailsComponent,
    GroupComponent,
    SubGroupComponent,
    LevelComponent,
    PostComponent,
    DarbandiComponent,
    EmptypeComponent,
    CouncilComponent,
    TrialComponent,
    OfficeComponent,
    OfficeCrud,
    PostCrud,
    DarbandiCrud,
    ReglistComponent,
    UserRegisterComponent,
    RegisteredUserListComponent,
    HealthOfficeComponent,
    EmplistComponent,
    EdulevelComponent,
    QualificationComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    PaginationModule.forRoot(),
    TreeModule
  ],
  providers: [
    ApiService,
    LoginService,
    AuthGuard,
    LoginGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

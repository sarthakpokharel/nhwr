import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Home1Component } from './home1/home1.component';

const routes: Routes = [

  {
    path: 'home',
    component:HomeComponent
  },
  {
    path: 'home1',
    component: Home1Component
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  groupForm!: FormGroup

  model: any = {};
  disabled = false;
 
 
  formLayout: any;
  admlvl:any;
  provinces:any;
  hfo:any;
  flag:any;
  adm:any;
  hf:any;
  district:any;
  palika:any;
  baseUrl: string = AppConfig.baseUrl;
  url= this.baseUrl+'registry';
  rep:any;
  filters:any;
  counts:any;
  sangh:any;
  pradesh:any;
  local:any;
  sanctioned:any;
  ethnicity:any;
 

  constructor(private RS: DashboardService, private toastr: ToastrService, private fb: FormBuilder) { 
    
    

  }

  ngOnInit(): void {
  
    this.getCount();
    this.getProvinces();
    this.getSanction();
    this.getEthincity();
  
  }
 

  
  getCount(){
    this.RS.getCount().subscribe(
      (result: any) => {
        this.counts = result.data[0];
       this.sangh=this.counts.sangh;
       this.pradesh=this.counts.pradesh;
       this.local=this.counts.local;
       this.hf=this.counts.hf;
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getSanction(){
    this.RS.getSanction().subscribe(
      (result: any) => {
        this.sanctioned = result.data[0];
    
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getEthincity(){
    this.RS.getEthincity().subscribe(
      (result: any) => {
        this.ethnicity = result.data;
    
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getProvinces(){
    this.RS.getProvinces().subscribe(
      (result: any) => {
        this.provinces = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }


 

  resetForm(){
    this.groupForm =this.fb.group(this.formLayout);
  }

 


}

import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DarbandiService } from './darbandi.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-darbandi',
  templateUrl: './darbandi.component.html',
  styleUrls: ['./darbandi.component.scss']
})
export class DarbandiComponent implements OnInit {
  modalRef?: BsModalRef;
  regForm!: FormGroup;
  formLayout: any;
  
  emptype:any;
  aid:any;
  levl:any;
  council:any;
  
  constructor(private modalService: BsModalService,private fb: FormBuilder,private RS: DarbandiService,private toastr: ToastrService,private router:Router) { 
    this.formLayout = {
      id:[],
      // provinceid: ['',Validators.required],
      // districtid: ['',Validators.required],
      // palika: ['',Validators.required],
      // ward: ['',Validators.required],
      // org: ['',Validators.required],
      // authority: ['', [Validators.required]],
      // authlevel: ['', [Validators.required]],
      // ownership: ['', [Validators.required]],
      // ftype: ['', [Validators.required]],
      
    }
    
    this.regForm =fb.group(this.formLayout);

  }

  

  ngOnInit(): void {
    this.addDetails(1);
    this.getEmptype();
    this.getLevel();
    this.getcouncil();
    // this.getHftype();
    // this.getSamuha();
    
  }

  groupFormSubmit(){
    // alert("hello");
    this.router.navigate(['/darbandi']);
  }

  getEmptype() {
    
    this.RS.getEmptype().subscribe(
      (result: any) => {
        this.emptype = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
 

}

getLevel() {
    
  this.RS.getLevel().subscribe(
    (result: any) => {
      this.levl = result.data;
      // console.log(this.provinces);
    },
    error => {
      this.toastr.error(error.error, 'Error');
    }
  );


}

getcouncil() {
    
  this.RS.getcouncil().subscribe(
    (result: any) => {
      this.council = result.data;
      // console.log(this.provinces);
    },
    error => {
      this.toastr.error(error.error, 'Error');
    }
  );


}


  addDetails(aid:any) {
    var items: number[] = [];
  for(var i = 1; i <= aid; i++){
    items.push(i);
  }
   this.aid=items;
    
 
   
  }

}


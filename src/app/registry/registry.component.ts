import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistryService } from './registry.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit {
  modalRef?: BsModalRef;
  regForm!: FormGroup;
  formLayout: any;
  provinces:any;
  district :any;
  palika:any;
  ward:any;
  hf:any;
  ownership :any;
  hftype:any;
  details:any;
  samuha:any;
  subgroup:any;
  posts:any;
  public fieldArray: Array<any> = [];
  public newAttribute: any = {};
  constructor(private modalService: BsModalService,private fb: FormBuilder,private RS: RegistryService,private toastr: ToastrService,private router:Router) { 
    this.formLayout = {
      id:[],
      provinceid: ['',Validators.required],
      districtid: ['',Validators.required],
      palika: ['',Validators.required],
      ward: ['',Validators.required],
      org: ['',Validators.required],
      authority: ['', [Validators.required]],
      authlevel: ['', [Validators.required]],
      ownership: ['', [Validators.required]],
      ftype: ['', [Validators.required]],
      groupid: ['', [Validators.required]],
      subgroupid: [''],
      post: ['', [Validators.required]],
      
    }
    
    this.regForm =fb.group(this.formLayout);

  }

  

  ngOnInit(): void {
    this.getProvinces();
    this.getOwnership();
    this.getHftype();
    this.getSamuha();
    
  }

  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
}

deleteFieldValue(index: number) {
    this.fieldArray.splice(index, 1);
}

  groupFormSubmit(){
    // alert("hello");
    // $("#c1").hide();
    this.router.navigate(['/darbandi']);
  }

  getSamuha() {
    
    this.RS.getSamuha().subscribe(
      (result: any) => {
        this.samuha = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
 

}

getSubgroup(gid:any){
  this.RS.getSubgroup(gid).subscribe(
    (result: any) => {
      this.subgroup = result.data;
      // console.log(this.provinces);
    },
    error => {
      this.toastr.error(error.error, 'Error');
    }
  );

}

getPost(gid:any){
  this.RS.getPost(gid).subscribe(
    (result: any) => {
      this.posts = result.data;
      // console.log(this.provinces);
    },
    error => {
      this.toastr.error(error.error, 'Error');
    }
  );
}



  getOwnership(){
    this.RS.getOwnership().subscribe(
      (result: any) => {
        this.ownership = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getHftype(){
    this.RS.getHftype().subscribe(
      (result: any) => {
        this.hftype = result.data;
        // console.log(this.provinces);
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

  getInfo(oid:any){
    this.RS.gethfDetails(oid).subscribe(
      (result: any) => {
        this.details = result.data;
        this.details=this.details[0];
        this.formLayout = {
          authority: [this.details.type, [Validators.required]],
          authlevel: [this.details.authlevel, [Validators.required]],
          ownership: [this.details.ownership, [Validators.required]],
          ftype: [this.details.level, [Validators.required]],
          
        }
        this.regForm =this.fb.group(this.formLayout);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getDistricts(pid:any){
    this.RS.getdistrict(pid).subscribe(
      (result: any) => {
        this.district = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getPalika(did:any){
    this.RS.getpalika(did).subscribe(
      (result: any) => {
        this.palika = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getHf(pid:any,wn:any){
    this.RS.gethf(pid,wn).subscribe(
      (result: any) => {
        this.hf = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getWard(mid:any){
    this.RS.getWard(mid).subscribe(
      (result: any) => {
        this.ward = result.data;
        this.ward = this.ward[0].numberofward;
        var items: number[] = [];
  for(var i = 1; i <= this.ward; i++){
    items.push(i);
  }

  this.ward=items;
        // console.log(this.ward[0].numberofward);
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
    this.modalRef = this.modalService.show(AddDetailsComponent, { initialState: {aid: items } });
    this.modalRef.setClass('modal-xl');
    
 
   
  }

  addRow(count:any){
    var counts=count+1;
    

  //   var htmls= '<tr id="row'+counts+'"><td> <select class="form-control" name="groupid" #gid formControlName="groupid" (change)="getSubgroup(gid.value);getPost(gid.value)"><option value="">-- समूह  छान्नुहोस् --</option>    <option *ngFor=" let item of samuha " [value]=item.id>{{ item.namenp}}</option></select></td></tr>	';
  //  var btn='<tr id="rowadd"><td>  <input type="button" class="btn btn-lg btn-block " id="addrow" value="Add Row" (click)="addRow('+counts+')"> </td></tr>';  
  //  $("#tbody").append(htmls);
  //  $("#foots").empty().append(btn);  
  }

}

@Component({
  templateUrl: './details.html'
})
export class AddDetailsComponent implements OnInit {
  @Input() aid: any;


  constructor(public modalRef: BsModalRef) {
    

  }

  ngOnInit() {
   

  }
}

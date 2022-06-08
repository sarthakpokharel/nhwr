import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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
export class RegistryComponent implements OnInit,AfterViewInit  {
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
  subgroup:any=[];
  posts:any=[];
  model: any = {};
  flag:any;
  admlvl:any;
  adm:any;
  hfo:any;
  public fieldArray: Array<any> = [];
  public newAttribute: any = {};
  rid:any=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];
  rn:any=1;
  constructor(private modalService: BsModalService,private fb: FormBuilder,private RS: RegistryService,private toastr: ToastrService,private router:Router) { 
    this.formLayout = {
      id:[],
      orgtype: ['',Validators.required],
      provinceid: ['',Validators.required],
      districtid: ['',Validators.required],
      palika: ['',Validators.required],
      ward: ['',Validators.required],
      org: ['0',Validators.required],
      authority: ['', [Validators.required]],
      authlevel: ['', [Validators.required]],
      ownership: ['', [Validators.required]],
      ftype: ['', [Validators.required]],
      officeid: ['0'],
      admlvl:[''],
      // groupid1: ['', [Validators.required]],
      // subgroupid1: [''],
      // post1: ['', [Validators.required]],
      // post_count1: ['', [Validators.required]]
      
    }
    
    this.regForm =fb.group(this.formLayout);

  }
  ngAfterViewInit(): void {
    $("#row1").show();
    
  }

  

  ngOnInit(): void {
    this.getProvinces();
    this.getOwnership();
    this.getHftype();
    this.getSamuha();
    this.formControl();
    this.getAdmlvl();
   
    
  }
  formControl(){
    for(var i=1;i<=50;i++){
    this.regForm.addControl('groupid'+i, new FormControl('', Validators.required));
    this.regForm.addControl('subgroupid'+i, new FormControl(''));
    this.regForm.addControl('post'+i, new FormControl('', Validators.required));
    this.regForm.addControl('post_count'+i, new FormControl('1', Validators.required));
    this.regForm.addControl('post_count_karar'+i, new FormControl('0', Validators.required));
    }
    
  }

  getOrgField(id:any){
    if(id==4){
      this.flag=0;
      $("#ward").show();
      $("#province").show();
      $("#dist").show();
      $("#munc").show();
      $("#auth").show();
      $("#alevel").show();
      $("#owner").show();
      $("#ftypes").show();
    }else{
      this.flag=1;
    }
  }

  getOffices(pid:any){
    this.RS.getorgs(pid).subscribe(
      (result: any) => {
        this.hfo = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  changeFlag(id:any){
      $("#ward").hide();
      $("#province").hide();
      $("#dist").hide();
      $("#munc").hide();
      $("#auth").hide();
      $("#alevel").hide();
      $("#owner").hide();
      $("#ftypes").hide();
    this.RS.getHfo(id).subscribe(
      (result: any) => {
        this.hfo = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
    if(id==1){
      this.adm=1;
      
    }else if(id==2){
      this.adm=1;
      $("#province").show();
    }else if(id==3){
      this.adm=1;
      $("#province").show();
      $("#dist").show();
    }else if(id==4){
      this.adm=0;
      $("#province").show();
      $("#dist").show();
      $("#munc").show();
    }else{
      this.adm=1;
    }
   
  }
  

  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
}

deleteFieldValue(index: number) {
    this.fieldArray.splice(index, 1);
}

groupFormSubmit(){
  this.model = this.regForm.value;
  if(this.regForm.value.groupid1=="" || this.regForm.value.post1==""){
    this.toastr.error('Please Fill the darbandi information.', 'Error');
    return;
  }
 if(this.regForm.value.orgtype==4){
   if(this.regForm.value.org==""){
    this.toastr.error('Please Select Health facility.', 'Error');
   }else{
    this.createItem(this.regForm.value.id);
   }
 }else{
  if(this.regForm.value.orgname==""){
    this.toastr.error('Please Mention Organization name.', 'Error');
   }else{
    this.createItem(this.regForm.value.id);
   }
 }
  this.model = this.regForm.value;
  
  // if (1==1) {
    
  //   // this.createItem(this.regForm.value.id);
  // } else {
  //   Object.keys(this.regForm.controls).forEach(field => {
  //     const singleFormControl = this.regForm.get(field);
  //     singleFormControl?.markAsTouched({onlySelf: true});
  //   });
  // }
}


createItem(id = null) {

  let upd = this.model;
  if (id != "" && id != null) {
    this.RS.update(id, upd).subscribe(result => {
    
      this.toastr.success('Item Successfully Updated!', 'Success');
      //this.groupForm.reset();
      // this.regForm =this.fb.group(this.formLayout);
      
    }, error => {
      this.toastr.error(error.message, 'Error');
    });
  } else {
    this.RS.create(upd).subscribe(
      (result:any) => {
     
      this.toastr.success('Item Successfully Saved!', 'Success');
      this.router.navigate(['/darbandi/'+result.data]);
      //this.groupForm.reset();
      // this.regForm =this.fb.group(this.formLayout);
      // this.getList();
    }, error => {
    
      this.toastr.error(error.error.message, 'Error');
    });
  }

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

getAdmlvl(){
  
  this.RS.getAdmlvl().subscribe(
    (result: any) => {
      this.admlvl = result.data;
      // console.log(this.provinces);
    },
    error => {
      this.toastr.error(error.error, 'Error');
    }
  );
}

getSubgroup(gid:any,cn:any){
  this.RS.getSubgroup(gid).subscribe(
    (result: any) => {
      this.subgroup[cn] = result.data;
      // console.log(this.subgroup[cn]);
    },
    error => {
      this.toastr.error(error.error, 'Error');
    }
  );

}

getPost(gid:any,cn:any){
  // alert(cn);
  this.RS.getPost(gid).subscribe(
    (result: any) => {
      this.posts[cn] = result.data;
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
        
        this.regForm.patchValue({
          authority: this.details.type, 
          authlevel: this.details.authlevel,
          ownership: this.details.ownership,
          ftype: this.details.level,
          org: this.details.hfid,
          provinceid: this.details.province,
          districtid: this.details.district,
          palika: this.details.municipality,
          ward: this.details.ward,
          
        });
      
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
    $("#row"+counts).show();
    this.rn=counts;
    // var items: number[] = [];
    // for(var i = 1; i <= counts; i++){
    //   items.push(i);
    // }
    // this.rid=items;
    // this.regForm.addControl('groupid'+counts);
// if(count==1){
//   this.regForm.addControl('groupid'+count, new FormControl('', Validators.required));
//     this.regForm.addControl('subgroupid'+count, new FormControl(''));
//     this.regForm.addControl('post'+count, new FormControl('', Validators.required));
//     this.regForm.addControl('post_count'+count, new FormControl('', Validators.required));
// }
    



    this.regForm.addControl('groupid'+counts, new FormControl('', Validators.required));
    this.regForm.addControl('subgroupid'+counts, new FormControl(''));
    this.regForm.addControl('post'+counts, new FormControl('', Validators.required));
    this.regForm.addControl('post_count'+counts, new FormControl('1', Validators.required));
    this.regForm.addControl('post_count_karar'+counts, new FormControl('0', Validators.required));

  //   var htmls= '<tr id="row'+counts+'"><td> <select class="form-control" name="groupid" #gid formControlName="groupid" (change)="getSubgroup(gid.value);getPost(gid.value)"><option value="">-- समूह  छान्नुहोस् --</option>    <option *ngFor=" let item of samuha " [value]=item.id>{{ item.namenp}}</option></select></td></tr>	';
  //  var btn='<tr id="rowadd"><td>  <input type="button" class="btn btn-lg btn-block " id="addrow" value="Add Row" (click)="addRow('+counts+')"> </td></tr>';  
  //  $("#tbody").append(htmls);
  //  $("#foots").empty().append(btn);  
  //  this.getSamuha();
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

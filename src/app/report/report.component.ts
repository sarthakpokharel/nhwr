import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import { ReportService } from './report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  groupForm!: FormGroup

  model: any = {};
  disabled = false;
  error = '';
  lists: any;
  perPages = [10, 20, 50, 100];
  pagination = {
    total: 0,
    currentPage: 0,
    perPage: 0
  };
  searchTerm: string = '';
  column: string = '';
  isDesc: boolean = false;

  srchForm: FormGroup;
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

  constructor(private RS: ReportService, private toastr: ToastrService, private fb: FormBuilder) { 
    
    this.formLayout = {
      id:[],
      orgtype: ['',Validators.required],
      provinceid: ['0',Validators.required],
      districtid: ['0',Validators.required],
      palika: ['0',Validators.required],
      org: ['0',Validators.required],
      officeid: ['0'],
      admlvl:[''],
      
    }
    
    this.groupForm =fb.group(this.formLayout)

    this.srchForm = new FormGroup({
      entries: new FormControl('10'),
      srch_term: new FormControl(''),
      
    })

  }

  ngOnInit(): void {
    // this.pagination.perPage = this.perPages[0];
    this.getAdmlvl();
    this.getProvinces();
  }
  getHf(pid:any){
    this.RS.gethf(pid).subscribe(
      (result: any) => {
        this.hf = result.data;
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
    $("#hfs").hide();
    $("#office").hide();
    if(id==1){
  this.RS.getHfo(id).subscribe(
    (result: any) => {
      this.hfo = result.data;
      // console.log(this.provinces);
    },
    error => {
      this.toastr.error(error.error, 'Error');
    }
  );
    }else{
      this.hfo=[];
    }
  if(id==1){
    this.adm=1;
    $("#office").show();
    
  }else if(id==2){
    this.adm=1;
    $("#province").show();
    $("#office").show();
  }else if(id==3){
    this.adm=1;
    $("#office").show();
    $("#province").show();
    $("#dist").show();
  }else if(id==4){
    this.adm=0;
    $("#province").show();
    $("#dist").show();
    $("#munc").show();
  }else{
    this.adm=1;
    $("#office").show();
  }
 
}

getOrgField(id:any){
  if(id==4){
    this.flag=0;
    $("#hfs").show();
    $("#ward").show();
    $("#province").show();
    $("#dist").show();
    $("#munc").show();
    $("#auth").show();
    $("#alevel").show();
    $("#owner").show();
    $("#ftypes").show();
    $("#admlevel").hide();
  }else{
    this.flag=1;
    $("#admlevel").show();
  }
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

 

  getReportsold(admid:any,pid:any,orgid:any){
    window.location.href = this.url+"/downloadreport?admid="+admid+"&pid="+pid+"&orgid="+orgid;
  }
  getReportsView2(orgtype:any,admlvl:any,pid:any,did:any,pal:any,hfid:any,ofc:any){
   
    if (this.groupForm.valid) {
      window.open(this.url+"/getData2?admid="+admlvl+"&pid="+pid+"&hfid="+hfid+"&did="+did+"&munc="+pal+"&ofc="+ofc+"&orgtype="+orgtype, '_blank');
    } else {
      Object.keys(this.groupForm.controls).forEach(field => {
        console.log(field);
        const singleFormControl = this.groupForm.get(field);
        singleFormControl?.markAsTouched({onlySelf: true});
      });
    }
    // window.location.href = this.url+"/getData?admid="+admlvl+"&pid="+pid+"&hfid="+hfid+"&did="+did+"&munc="+pal+"&ofc="+ofc+"&orgtype="+orgtype;
    // this.RS.getReportview(orgtype,admlvl,pid,did,pal,hfid,ofc).subscribe(
    //   (result: any) => {
    //     this.rep = result.data;
    //     console.log(this.rep);
    //   },
    //   error => {
    //     this.toastr.error(error.error, 'Error');
    //   }
    // );
  }
  getReportsView(orgtype:any,admlvl:any,pid:any,did:any,pal:any,hfid:any,ofc:any){
   
    if (this.groupForm.valid) {
      window.open(this.url+"/getData?admid="+admlvl+"&pid="+pid+"&hfid="+hfid+"&did="+did+"&munc="+pal+"&ofc="+ofc+"&orgtype="+orgtype, '_blank');
    } else {
      Object.keys(this.groupForm.controls).forEach(field => {
        console.log(field);
        const singleFormControl = this.groupForm.get(field);
        singleFormControl?.markAsTouched({onlySelf: true});
      });
    }
    // window.location.href = this.url+"/getData?admid="+admlvl+"&pid="+pid+"&hfid="+hfid+"&did="+did+"&munc="+pal+"&ofc="+ofc+"&orgtype="+orgtype;
    // this.RS.getReportview(orgtype,admlvl,pid,did,pal,hfid,ofc).subscribe(
    //   (result: any) => {
    //     this.rep = result.data;
    //     console.log(this.rep);
    //   },
    //   error => {
    //     this.toastr.error(error.error, 'Error');
    //   }
    // );
  }

  getReports(orgtype:any,admlvl:any,pid:any,did:any,pal:any,hfid:any,ofc:any){
    if (this.groupForm.valid) {
      window.location.href = this.url+"/downloadreport?admid="+admlvl+"&pid="+pid+"&hfid="+hfid+"&did="+did+"&munc="+pal+"&ofc="+ofc+"&orgtype="+orgtype;
    } else {
      Object.keys(this.groupForm.controls).forEach(field => {
        console.log(field);
        const singleFormControl = this.groupForm.get(field);
        singleFormControl?.markAsTouched({onlySelf: true});
      });
    }
   
  }

  getReport2(orgtype:any,admlvl:any,pid:any,did:any,pal:any,hfid:any,ofc:any){
    if (this.groupForm.valid) {
      window.location.href = this.url+"/downloadreport2?admid="+admlvl+"&pid="+pid+"&hfid="+hfid+"&did="+did+"&munc="+pal+"&ofc="+ofc+"&orgtype="+orgtype;
    } else {
      Object.keys(this.groupForm.controls).forEach(field => {
        console.log(field);
        const singleFormControl = this.groupForm.get(field);
        singleFormControl?.markAsTouched({onlySelf: true});
      });
    }
   
  }

  getAdmin(aid:any){
    if(aid==2){
      $("#prov").show();
    }else{
      $("#prov").hide();
    }
    if(aid==1||aid==4){
    this.RS.getHfo(aid).subscribe(
      (result: any) => {
        this.hfo = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
    }else{
      this.hfo=[];
    }
  }

  groupFormSubmit(){
    if (this.groupForm.valid) {
      this.model = this.groupForm.value;
      this.createItem(this.groupForm.value.id);
    } else {
      Object.keys(this.groupForm.controls).forEach(field => {
        const singleFormControl = this.groupForm.get(field);
        singleFormControl?.markAsTouched({onlySelf: true});
      });
    }
  }

 
  createItem(id = null) {

    let upd = this.model;
    if (id != "" && id != null) {
      this.RS.update(id, upd).subscribe(result => {
        this.toastr.success('Item Successfully Updated!', 'Success');
        //this.groupForm.reset();
        this.groupForm =this.fb.group(this.formLayout);
        this.getList();
      }, error => {
        this.toastr.error(error.error, 'Error');
      });
    } else {
      this.RS.create(upd).subscribe(result => {
        this.toastr.success('Item Successfully Saved!', 'Success');
        //this.groupForm.reset();
        this.groupForm =this.fb.group(this.formLayout);
        this.getList();
      }, error => {
        this.toastr.error(error.error, 'Error');
      });
    }

  }

  resetForm(){
    this.groupForm =this.fb.group(this.formLayout);
  }

  getList(pageno?: number | undefined) {
    const page = pageno || 1;
    this.RS.getList(this.pagination.perPage, page, this.searchTerm, this.column, this.isDesc).subscribe(
      (result: any) => {
        this.lists = result.data;
        this.pagination.total = result.total;
        this.pagination.currentPage = result.currentPage;
        ///console.log(result);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  paginatedData($event: { page: number | undefined; }) {
    this.getList($event.page);
  }

  changePerPage(perPage: number) {
    this.pagination.perPage = perPage;
    this.pagination.currentPage = 1;
    this.getList();
  }

  search() {
    this.pagination.perPage=this.srchForm.value.entries;
    this.searchTerm=this.srchForm.value.srch_term;
    this.getList();

  }

  resetFilters() {
    this.isDesc = false;
    this.column = '';
    this.searchTerm = '';
    this.pagination.currentPage = 1;
    this.getList();
  }

  getUpdateItem(id: any) {
    this.RS.getEdit(id).subscribe(
      (result: any) => {
        this.model = result;
        this.groupForm.patchValue(result);
      },
      (error: any) => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  deleteItem(id: any) {
    if (window.confirm('Are sure you want to delete this item?')) {
      this.RS.remove(id).subscribe((result: any) => {
        this.toastr.success('Item Successfully Deleted!', 'Success');
        this.getList();
      }, (error: { error: any; }) => {
        this.toastr.error(error.error, 'Error');
      });
    }
  }

}

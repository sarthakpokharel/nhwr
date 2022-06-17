import { Component, Injectable, Input,EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmplistService } from './emplist.service';
import { AppConfig } from '../app.config';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Injectable({
  providedIn: 'root' // just before your class
})

@Component({
  selector: 'app-emplist',
  templateUrl: './emplist.component.html',
  styleUrls: ['./emplist.component.scss']
})
export class EmplistComponent implements OnInit {

  baseUrl: string = AppConfig.baseUrl;
  url= this.baseUrl+'registry';

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

  constructor(private RS: EmplistService, private toastr: ToastrService, private fb: FormBuilder,private modalService: BsModalService,) { 
    
    this.formLayout = {
      id:[],
      nameen: ['',Validators.required],
      namenp: ['', [Validators.required]],
      status: ['1', [Validators.required]],
      
    }
    
    this.groupForm =fb.group(this.formLayout)

    this.srchForm = new FormGroup({
      entries: new FormControl('10'),
      srch_term: new FormControl(''),
      
    })

  }

  ngOnInit(): void {
    this.pagination.perPage = this.perPages[0];
    this.getList();
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
  modalRef:any;
  transferEmp(id :any,empname:any,wid:any){
    this.modalRef = this.modalService.show(TransferCrud,{initialState:{empid:id,empname:empname,wid:wid}});
    this.modalRef.setClass('modal-xl');
    this.modalRef.content.afterSave.subscribe(()=>{
      this.getList();
    });
   
  } 
  retire(id :any,empname:any,wid:any){
    this.modalRef = this.modalService.show(RetireCrud,{initialState:{empid:id,empname:empname,wid:wid}});
    this.modalRef.setClass('modal-xl');
    this.modalRef.content.afterSave.subscribe(()=>{
      this.getList();
    });
  }
  download(id:any){
    
    //  const h=this.RS.downloadcsv(id);
    window.location.href = this.url+"/downloadcsv?id="+id;
    // this.RS.downloadcsv(id).subscribe(
    //   (result: any) => {
    //     // this.orglists = result.data;
    //   },
    //   error => {
    //     console.log(error);
    //     this.toastr.error(error.error, 'Error');
    //   }
    // );
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
    if (window.confirm('Are  you sure want to delete this item?')) {
      this.RS.remove(id).subscribe((result: any) => {
        this.toastr.success('Item Successfully Deleted!', 'Success');
        this.getList();
      }, (error: { error: any; }) => {
        this.toastr.error(error.error, 'Error');
      });
    }
  }

}

@Component({
  templateUrl: './transfer.form.html',
  styleUrls: ['./emplist.component.scss'],
})
export class TransferCrud implements OnInit{
  public afterSave:EventEmitter<any>=new EventEmitter();
  
  [x: string]: any;
  
  html!: '';

  
  @Input() empid:any;
  @Input() empname:any;
  @Input() wid:any;

 
  
  officeForm!: FormGroup
  

  constructor(public modalRef: BsModalRef, private toastr: ToastrService, private RS: EmplistService, private fb:FormBuilder,private ofc:EmplistComponent){
    this.formLayout = {
      id:[],
      orgtype: ['',Validators.required],
      provinceid: [''],
      districtid: [''],
      palika: [''],
      org: ['0'],
      officeid: ['0'],
      admlvl:[''],
      empid:[],
      wid:[]
      
    }
    
    this.officeForm =fb.group(this.formLayout)
    
  }
  model:any;
  ngOnInit(){
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
    $("#office").hide();
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

  
  officeFormSubmit() {

    if (this.officeForm.valid) {
     
      this.officeForm.value.empid=this.empid;
      this.officeForm.value.wid=this.wid;
      // this.officeForm.value.detailsid=this.detailsid;
      this.model = this.officeForm.value;
      this.createItem(this.officeForm.value.id);
    } else {
      Object.keys(this.officeForm.controls).forEach(field => {
        const singleFormControl = this.officeForm.get(field);
        singleFormControl!.markAsTouched({onlySelf: true});
      });
    }
  }

  createItem(id = null) {
    let upd = this.model;
    if (id != "" && id !=null) {

      // this.RS.update(id, upd).subscribe(result => {
      //   this.toastr.success('Item Successfully Updated!', 'Success');
      //   this.officeForm.reset();
      //   this.afterSave.emit();
      //   this.modalRef.hide();
       
      // }, error => {
      //   this.toastr.error(error.error, 'Error');
      // });
    } else {
      this.RS.createtransfer(upd).subscribe(result => {
        this.toastr.success('Item Successfully Saved!', 'Success');
        this.officeForm.reset();
        this.afterSave.emit();
        this.modalRef.hide();
        // this.closebutton.nativeElement.click();
        // this.orgchange.nativeElement.click();
        
      }, error => {
        this.toastr.error(error.error, 'Error');
      });
    }
  // }
}
}

@Component({
  templateUrl: './retire.form.html',
  styleUrls: ['./emplist.component.scss'],
})
export class RetireCrud implements OnInit{
  public afterSave:EventEmitter<any>=new EventEmitter();
  
  [x: string]: any;
  
  html!: '';

  
  @Input() empid:any;
  @Input() empname:any;
  @Input() wid:any;

 
  
  officeForm!: FormGroup
  

  constructor(public modalRef: BsModalRef, private toastr: ToastrService, private RS: EmplistService, private fb:FormBuilder,private ofc:EmplistComponent){
    this.formLayout = {
      id:[],
      retire_date: ['',Validators.required],
      remarks: [''],
      empid:[],
      wid:[]
      
    }
    
    this.officeForm =fb.group(this.formLayout)
    
  }
  model:any;
  ngOnInit(){
    // this.getAdmlvl();
    // this.getProvinces();
  
  }
  officeFormSubmit() {

    if (this.officeForm.valid) {
     
      this.officeForm.value.empid=this.empid;
      this.officeForm.value.wid=this.wid;
      // this.officeForm.value.detailsid=this.detailsid;
      this.model = this.officeForm.value;
      this.createItem(this.officeForm.value.id);
    } else {
      Object.keys(this.officeForm.controls).forEach(field => {
        const singleFormControl = this.officeForm.get(field);
        singleFormControl!.markAsTouched({onlySelf: true});
      });
    }
  }

  createItem(id = null) {
    let upd = this.model;
    if (id != "" && id !=null) {

      // this.RS.update(id, upd).subscribe(result => {
      //   this.toastr.success('Item Successfully Updated!', 'Success');
      //   this.officeForm.reset();
      //   this.afterSave.emit();
      //   this.modalRef.hide();
       
      // }, error => {
      //   this.toastr.error(error.error, 'Error');
      // });
    } else {
      this.RS.createRetire(upd).subscribe(result => {
        this.toastr.success('Item Successfully Saved!', 'Success');
        this.officeForm.reset();
        this.afterSave.emit();
        this.modalRef.hide();
        // this.closebutton.nativeElement.click();
        // this.orgchange.nativeElement.click();
        
      }, error => {
        this.toastr.error(error.error, 'Error');
      });
    }
  // }
}
}

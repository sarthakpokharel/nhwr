import { Component, Injectable, Input, OnInit } from '@angular/core';
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
  transferEmp(id :any,empname:any){
    this.modalRef = this.modalService.show(TransferCrud,{initialState:{empid:id,empname:empname}});
   
  } 
  retire(id:any){
    // alert(id);
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
 
  
  [x: string]: any;
  
  html!: '';

  
  @Input() empid:any;
  @Input() empname:any;

 
  
  officeForm!: FormGroup
  

  constructor(public modalRef: BsModalRef, private toastr: ToastrService, private RS: EmplistService, private fb:FormBuilder,private ofc:EmplistComponent){
    this.officeForm = new FormGroup({
      id: new FormControl(''),
      darbandiid: new FormControl(''),
      post_no: new FormControl('0'),
      post_no_karar: new FormControl('0'),
     
      
    })
    
  }
  model:any;
  ngOnInit(){
    
  
  }

  
  officeFormSubmit() {

    if (this.officeForm.valid) {
      if(this.isEdit!=1){
        // this.officeForm.value.parentofficeid=this.officeid;
      }
    
      // this.officeForm.value.orgidint=this.orgidint;
      // this.officeForm.value.workforceid=this.workforceid;
      this.officeForm.value.darbandiid=this.darbandiid;
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
  //   let upd = this.model;
  //   if (id != "" && id !=null) {

  //     // this.RS.update(id, upd).subscribe(result => {
  //     //   this.toastr.success('Item Successfully Updated!', 'Success');
  //     //   this.officeForm.reset();
  //     //   this.afterSave.emit();
  //     //   this.modalRef.hide();
       
  //     // }, error => {
  //     //   this.toastr.error(error.error, 'Error');
  //     // });
  //   } else {
  //     this.RS.createDarbandi(upd).subscribe(result => {
  //       this.toastr.success('Item Successfully Saved!', 'Success');
  //       this.officeForm.reset();
  //       this.afterSave.emit();
  //       this.modalRef.hide();
  //       // this.closebutton.nativeElement.click();
  //       // this.orgchange.nativeElement.click();
        
  //     }, error => {
  //       this.toastr.error(error.error, 'Error');
  //     });
  //   }
  // }
}
}

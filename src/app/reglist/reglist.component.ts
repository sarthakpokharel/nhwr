import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReglistService } from './reglist.service';
import { AppConfig } from '../app.config';


@Component({
  selector: 'app-reglist',
  templateUrl: './reglist.component.html',
  styleUrls: ['./reglist.component.scss']
})
export class ReglistComponent implements OnInit {

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

  constructor(private RS: ReglistService, private toastr: ToastrService, private fb: FormBuilder) { 
    
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

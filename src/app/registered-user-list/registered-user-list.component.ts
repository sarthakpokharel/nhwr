import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../app.config';
import {ReglistService} from './registered-user-list.service'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-registered-user-list',
  templateUrl: './registered-user-list.component.html',
  styleUrls: ['./registered-user-list.component.scss']
})
export class RegisteredUserListComponent implements OnInit {

  changePasswordFormLayout: any;
  changePasswordForm: any;

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
  modalRef?: BsModalRef;

  currentId: any

  openModal(template: TemplateRef<any>, id:any) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.currentId = id;
  }

  changePassword(){
    if (this.changePasswordForm.value.password == this.changePasswordForm.value.rpassword && (this.changePasswordForm.value.password!==null && this.changePasswordForm.value.rpassword!==null)){
      this.model = this.changePasswordForm.value;
      this.updatePassword(this.currentId);
    }
    else{
      this.toastr.error("Passwords do not match","Error")
    }
  }

  updatePassword(id: any){
    let upd = this.model;
    this.RS.update(id, upd).subscribe(result => {
      this.toastr.success('Item Successfully Updated!', 'Success');
      this.changePasswordForm =this.fb.group(this.changePasswordFormLayout);
      this.modalRef?.hide()
      // this.getList();
    }, error => {
      this.toastr.error(error.error, 'Error');
    });
  }

  showPassword(e: any){
    const el: any = e.target;
    const element = el.parentElement?.parentElement.previousElementSibling?.firstChild
    if (element.type == "text"){
      el.classList.remove('bi-eye-fill');
      el.classList.add('bi-eye-slash-fill')
      element.type = "password";
     
    }  
    else{
      element.type = "text";
      el.classList.remove('bi-eye-slash-fill')
      el.classList.add('bi-eye-fill');
      
    }
   

  }

  constructor(private RS: ReglistService, private toastr: ToastrService, private fb: FormBuilder, private modalService: BsModalService) { 
    
    this.changePasswordFormLayout ={
      password: [null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      rpassword: [null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]]
    }

    this.formLayout = {
      id:[],
      nameen: ['',Validators.required],
      namenp: ['', [Validators.required]],
      status: ['1', [Validators.required]],
      
    }

    this.changePasswordForm = fb.group(this.changePasswordFormLayout)
    
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

}

import { AfterViewInit, Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import {OfficeService } from './office.service';
import { ToastrService } from 'ngx-toastr';
import { ITreeOptions, TreeComponent, TreeModel, TreeNode, TREE_ACTIONS } from '@circlon/angular-tree-component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root' // just before your class
})
@Component({

  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss'],
  template: '<tree-root #tree [nodes]="nodes" [options]="options" (updateData)="onUpdateData($event)" >'
 
})

export class OfficeComponent implements OnInit,AfterViewInit {
  
  @ViewChild('tree') tree?: TreeComponent;
  @ViewChild('orgchange') orgchange:any;
  model: any = {};
  disabled = false;
  error = '';
  lists: any;
  nodes:any = [];
  perPages = [10, 20, 50, 100];
  pagination = {
    total: 0,
    currentPage: 0,
    perPage: 0
  };
  searchTerm: string = '';
  column: string = '';
  isDesc: boolean = false;
  orgids:any;
  orglists:any;

  officeForm!: FormGroup
  srchForm: FormGroup;
  darid:any;

 

  constructor(private RS: OfficeService, private toastr: ToastrService,private modalService: BsModalService,private _Activatedroute:ActivatedRoute) {
    this.srchForm = new FormGroup({
      orgid: new FormControl(''),
    });
    this.nodes=[];
  }

  ngOnInit(): void {
    this.pagination.perPage = this.perPages[0];
    this.getOrgLists();
    this.darid=this._Activatedroute.snapshot.paramMap.get("id");
    if(this.darid==0){
      this.darid="";
    }
    this.srchForm.patchValue({
      orgid: this.darid
    });
    this.getTree(this.darid);
  }

  ngAfterViewInit(){
    // console.log(this.tree);
    
  }

  onUpdateData(event: any){
    
    // this.tree?.treeModel.expandAll();
    const firstRoot = this.tree?.treeModel.roots[0];
    firstRoot?.expandAll();

    
  }

  hideAll(e: any) {

    var ele: HTMLElement = e.target;

    if (ele.classList.contains('fa-chevron-circle-right')) {
      ele.classList.remove('fa-chevron-circle-right');
      ele.classList.add("fa-chevron-circle-down");
    }

    else {
      ele.classList.add('fa-chevron-circle-right');
      ele.classList.remove("fa-chevron-circle-down");
    }
    var i: any
    var element = document.getElementsByClassName('a');
    for (i = 0; i <= element.length; i++) {
      if (element[i].classList.contains('show')) {
        element[i].classList.add('hide');
        element[i].classList.remove('show');
      }
      else {
        element[i].classList.remove('hide');
        element[i].classList.add('show');
      }

    }
  }

  hideChildNodes(e: any) {
    var element: HTMLElement = e.target;

    if (element.classList.contains('fa-chevron-circle-right')) {
      element.classList.remove('fa-chevron-circle-right');
      element.classList.add("fa-chevron-circle-down");
    }

    else {
      element.classList.add('fa-chevron-circle-right');
      element.classList.remove("fa-chevron-circle-down");
    }

    var cn = element.parentElement?.nextElementSibling;
    if (cn?.classList.contains('show')) {
      cn.classList.add('hide');
      cn.classList.remove('show')
    }
    else {
      cn!.classList.remove('hide');
      cn!.classList.add('show')
    }
  }

  getOrgLists(){
    this.RS.getOrglist().subscribe(
      (result: any) => {
        this.orglists = result.data;
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getTree(id:any){
    this.RS.getListTree(id).subscribe(
      (result: any) => {
        this.nodes = result.data;
       setTimeout(() => {
        this.tree?.treeModel.update();
       }, 1000);
          
      this.onUpdateData(null);
       
        // console.log(this.nodes);
        // this.tree?.treeModel.update();
       
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  getSections() {
    this.orgids=this.srchForm.value.orgid;
    // this.orgids=666;
    if(this.orgids!=""){
      
      this.getTree(this.orgids);
    }
    
  }


  modalRef:any;
  addSection(sid:any,oid:any,post:any,darbandiid:any,detailsid:any) {
    // alert(oid);
    this.modalRef = this.modalService.show(OfficeCrud,{initialState:{workforceid:sid,orgidint:oid,tree:this.tree,orgchange:this.orgchange,post:post,darbandiid:darbandiid,detailsid:detailsid}});
    this.modalRef.content.afterSave.subscribe(()=>{
      this.getSections();
    });
    // this.officeForm.value.parentofficeid=node.data.officeidint;
  }
  editSection(sid:any,oid:any,post:any,darbandiid:any,detailsid:any,empid:any) {
   
    this.modalRef = this.modalService.show(OfficeCrud,{initialState:{workforceid:sid,isEdit:1,orgidint:oid,tree:this.tree,orgchange:this.orgchange,post:post,darbandiid:darbandiid,detailsid:detailsid,empid:empid}});
    this.modalRef.content.afterSave.subscribe(()=>{
      this.getSections();
    });
  }



  

  

}

@Component({
  templateUrl: './office.form.html',
  styleUrls: ['./office.component.scss'],
})
export class OfficeCrud implements OnInit{
  public afterSave:EventEmitter<any>=new EventEmitter();
  
  [x: string]: any;
  
  html!: '';

  @Input() workforceid:any;
  @Input() post:any;
  @Input() orgidint:any;
  @Input() isEdit:any;
  @Input() darbandiid:any;
  @Input() detailsid:any;
  @Input() empid:any;
  
  officeForm!: FormGroup
  

  constructor(public modalRef: BsModalRef, private toastr: ToastrService, private RS: OfficeService, private fb:FormBuilder,private ofc:OfficeComponent){
    this.officeForm = new FormGroup({
      id: new FormControl(''),
      workforceid: new FormControl(''),
      darbandiid: new FormControl(''),
      detailsid: new FormControl(''),
      orgidint: new FormControl(''),
      nameen: new FormControl('', Validators.required),
      namenp: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      email: new FormControl(''),
      mobile: new FormControl(''),
      emptype: new FormControl(''),
      level: new FormControl(''),
      apoint_date: new FormControl(''),
      att_date: new FormControl(''),
      education: new FormControl(''),
      council: new FormControl(''),
      council_no: new FormControl(''),
      
    })
    
  }
  model:any;
  ngOnInit(){
    if(this.isEdit==1){
      this.getUpdateItem(this.empid);
    }
    this.getEmptype();
    this.getLevel();
    this.getcouncil();
  
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

  
  
  
  getUpdateItem(id: any) {
   
    this.RS.getEdit(id).subscribe(
      (result: any) => {
        this.model = result;
        this.officeForm.patchValue(result);
        // this.getFiles(result.headerid);
      },
      (error: any) => {
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  


  
  officeFormSubmit() {

    if (this.officeForm.valid) {
      if(this.isEdit!=1){
        // this.officeForm.value.parentofficeid=this.officeid;
      }
    
      this.officeForm.value.orgidint=this.orgidint;
      this.officeForm.value.workforceid=this.workforceid;
      this.officeForm.value.darbandiid=this.darbandiid;
      this.officeForm.value.detailsid=this.detailsid;
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

      this.RS.update(id, upd).subscribe(result => {
        this.toastr.success('Item Successfully Updated!', 'Success');
        this.officeForm.reset();
        this.afterSave.emit();
        this.modalRef.hide();
       
      }, error => {
        this.toastr.error(error.error, 'Error');
      });
    } else {
      this.RS.create(upd).subscribe(result => {
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
  }
}





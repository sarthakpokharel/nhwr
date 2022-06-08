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
      $("#missing").hide();
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

  removePost(wid:any,oid:any,post:any,darbandiid:any,detailsid:any){
    if (window.confirm('Are sure you want to Remove the Post?')) {
      this.RS.removePost(wid,darbandiid,detailsid,oid).subscribe((result: any) => {
        this.toastr.success('Item Successfully Deleted!', 'Success');
        // this.darid=this._Activatedroute.snapshot.paramMap.get("id");
        this.getTree(wid);
      }, (error: { error: any; }) => {
        this.toastr.error(error.error, 'Error');
      });
    }
  }

  removeemp(did:any,empid:any,orgid:any){
    // alert(orgid);
    if (window.confirm('Are sure you want to Remove the Employee?')) {
      this.RS.removeEmp(empid).subscribe((result: any) => {
        this.toastr.success('Item Successfully Deleted!', 'Success');
        // this.darid=this._Activatedroute.snapshot.paramMap.get("id");
        this.getTree(orgid);
      }, (error: { error: any; }) => {
        this.toastr.error(error.error, 'Error');
      });
    }
  
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
    if(id==0){
      $("#missing").hide();
    }else{
      $("#missing").show();
    }
    // alert(id);
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
      $("#missing").show();
      this.getTree(this.orgids);
    }else{
      $("#missing").hide();
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

  addDarbandi(did:any,post:any){
    this.modalRef = this.modalService.show(DarbandiCrud,{initialState:{tree:this.tree,orgchange:this.orgchange,post:post,darbandiid:did}});
    this.modalRef.content.afterSave.subscribe(()=>{
      this.getSections();
    });
  }

  addMissingpost(wid:any){
    this.modalRef = this.modalService.show(PostCrud,{initialState:{tree:this.tree,orgchange:this.orgchange,workforceid:wid}});
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
  
  officeForm!: FormGroup;
  emps:any;
  

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
      email: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      emptype: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      apoint_date: new FormControl('', [Validators.required]),
      att_date: new FormControl('', [Validators.required]),
      education: new FormControl('', [Validators.required]),
      council: new FormControl('', [Validators.required]),
      council_no: new FormControl('', [Validators.required]),
      pis: new FormControl(''),
      qualification: new FormControl('', [Validators.required]),
      
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
    this.geteduLevel();
  
  }

  getnmc(cno:any){
    this.RS.getemp(cno).subscribe(
      (result: any) => {
        this.emps = result.data[0];
        this.officeForm.patchValue(this.emps);
        // console.log(this.emps);
      },
      error => {
        this.toastr.error(error.error, 'Error');
      }
    );
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

getPis(tid:any){
  if(tid==1 || tid==8){
    $("#pisno").show();
  }else{
    $("#pisno").hide();
  }
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

geteduLevel() {
    
  this.RS.geteduLevel().subscribe(
    (result: any) => {
      this.elevel = result.data;
      // console.log(this.provinces);
    },
    error => {
      this.toastr.error(error.error, 'Error');
    }
  );


}

getQualification(eid:any,cid:any){
  this.RS.getQualification(eid,cid).subscribe(
    (result: any) => {
      this.qual = result.data;
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
        this.getQualification(result.education,result.council);
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

@Component({
  templateUrl: './darbandi.form.html',
  styleUrls: ['./office.component.scss'],
})
export class DarbandiCrud implements OnInit{
  public afterSave:EventEmitter<any>=new EventEmitter();
  
  [x: string]: any;
  
  html!: '';

  
  @Input() post:any;
  
  @Input() isEdit:any;
  @Input() darbandiid:any;
 
  
  officeForm!: FormGroup
  

  constructor(public modalRef: BsModalRef, private toastr: ToastrService, private RS: OfficeService, private fb:FormBuilder,private ofc:OfficeComponent){
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
      this.RS.createDarbandi(upd).subscribe(result => {
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

@Component({
  templateUrl: './post.form.html',
  styleUrls: ['./office.component.scss'],
})
export class PostCrud implements OnInit,AfterViewInit{
  public afterSave:EventEmitter<any>=new EventEmitter();
  
  [x: string]: any;
  
  html!: '';

  
  @Input() post:any;
  
  @Input() isEdit:any;
  @Input() workforceid:any;
  rid:any=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];
  rn:any=1;
  samuha:any;
  subgroup:any=[];
  posts:any=[];
  
  regForm!: FormGroup;
  formLayout: any;

  constructor(public modalRef: BsModalRef, private toastr: ToastrService, private RS: OfficeService, private fb:FormBuilder,private ofc:OfficeComponent){
    this.formLayout = {
      id:[''],
      workforceid: [''],
      
      // groupid1: ['', [Validators.required]],
      // subgroupid1: [''],
      // post1: ['', [Validators.required]],
      // post_count1: ['', [Validators.required]]
      
    }
    
    this.regForm =fb.group(this.formLayout);
    
  }
  model:any;
  ngOnInit(){
    this.getSamuha();
    this.formControl();
  
  }

  ngAfterViewInit(): void {
    $("#row1").show();
    
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

  
  officeFormSubmit() {
    
    // if (this.regForm.valid) {
      if(this.regForm.value.groupid1=="" || this.regForm.value.post1==""){
        this.toastr.error('Please Fill the darbandi information.', 'Error');
        return;
      }else{
      this.regForm.value.workforceid=this.workforceid;
      // this.officeForm.value.detailsid=this.detailsid;
      this.model = this.regForm.value;
      this.createItem(this.regForm.value.id);
      }
    // } else {
    //   Object.keys(this.regForm.controls).forEach(field => {
    //     const singleFormControl = this.regForm.get(field);
    //     singleFormControl!.markAsTouched({onlySelf: true});
    //   });
    // }
  }

  createItem(id = null) {
    let upd = this.model;
    console.log(upd);
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
      this.RS.createpost(upd).subscribe(result => {
        this.toastr.success('Item Successfully Saved!', 'Success');
        this.regForm.reset();
        this.afterSave.emit();
        this.modalRef.hide();
        // this.closebutton.nativeElement.click();
        // this.orgchange.nativeElement.click();
        
      }, error => {
        this.toastr.error(error.error, 'Error');
      });
    }
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






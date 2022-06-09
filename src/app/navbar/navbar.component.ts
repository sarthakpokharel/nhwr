import { Component, OnInit } from '@angular/core';

import { LoginService } from '../admin-login/login.service';
import { RegistryService } from '../registry/registry.service';
import { Router } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  islogedin:any;

  changePasswordForm: any
  changePasswordFormLayout: any;

  modalRef?: BsModalRef;
  model: any;
  role:any;
  constructor(private ls: LoginService,private router:Router,private RS: RegistryService, private modalService: BsModalService, private fb: FormBuilder, private ts: ToastrService) {
    this.changePasswordFormLayout = {
      opassword: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      rpassword: [null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]]
    }

    this.changePasswordForm = fb.group(this.changePasswordFormLayout)
   }

  ngOnInit(): void {
    this.getUserinfo();
    this.getProvinces();
    this.userInfo = this.ls.retriveUserData().user.username;
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

  userInfo:any

  changePassword(){
    if (this.changePasswordForm.value.password == this.changePasswordForm.value.rpassword && (this.changePasswordForm.value.password!==null && this.changePasswordForm.value.rpassword!==null)){
      this.model = this.changePasswordForm.value;
      this.updatePassword(this.ls.retriveUserData().user.userid);
    }
    else{
      this.ts.error("Passwords do not match","Error")
    }
  }

  updatePassword(id: any){
    let upd = this.model;
    this.RS.updateSelf(id, upd).subscribe(result => {
      this.ts.success('Item Successfully Updated!', 'Success');
      this.changePasswordForm =this.fb.group(this.changePasswordFormLayout);
      this.modalRef?.hide()
      // this.getList();
    }, error => {
      this.ts.error(error.error, 'Error');
    });
  }

  getProvinces(){
    this.RS.getProvinces().subscribe(
      (result: any) => {
        // this.provinces = result.data;
        // console.log(this.provinces);
      },
      error => {
        console.log(error.error.message);
        if(error.error.message=="Token Exprired" || error.error.message=="Illigal token"){
          this.ls.removeUserData();
          // window.location.reload();
          this.router.navigate(['/']);
         
          // .then(() => {
          //   window.location.reload();
          // });
        }
        // this.toastr.error(error.error, 'Error');
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' }));
  }

  getUserinfo(){
    if(this.ls.retriveUserData()==null){
      this.islogedin=0;
      this.role=0;
    }else{
     if(this.ls.retriveUserData().user.role=="superuser"){
      this.role=1;
     }else{
      this.role=0;
     }
      this.islogedin=1;
    }
    console.log(this.ls.retriveUserData());
  }

  logout() {
    if (window.confirm('Are sure you want to Log Out?')) {
    this.ls.removeUserData();
    this.router.navigate(['/admin-login'])
  .then(() => {
    window.location.reload();
  });
}
    // this.router.navigate(['/admin-login']);
}


  changeContent(e: any) {
    const element: HTMLElement = e.target;
    const active = document.getElementsByClassName('active');

    for (var i = 0; i < active.length; i++) {
      active[i].classList.remove('active')
    }
    element.classList.add('active');

  }

  changeContentDropdown(e: any){
    var el: any = e.target;
    var element = el.parentElement.parentElement.firstChild;

    const active = document.getElementsByClassName('active');

    for (var i = 0; i < active.length; i++) {
      active[i].classList.remove('active')
    }
    element.classList.add('active');
  }

}

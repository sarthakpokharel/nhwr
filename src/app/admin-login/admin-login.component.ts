import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from './login.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  formLayout: any;


  constructor(private ls: LoginService, private router:Router, private toastr: ToastrService, private fb: FormBuilder) { 
    this.formLayout = {
      username: ['', Validators.required],
      password: ['', Validators.required]
    };
    
    this.loginForm = fb.group(this.formLayout);
  }

  ngOnInit(): void {
  }

  submitForm(){
    if(this.loginForm.valid){
      this.ls.login(this.loginForm.value).subscribe(data=>{
        // alert("hellpo");
        
        this.ls.storeUserData(data.data);
        this.router.navigate(['/registry']);
      },err=>{
        console.log(err);

        // this.loginForm = this.fb.group(this.formLayout);

        this.toastr.error('Invalid Username or Password', 'Login Error!', {
          timeOut: 5000,
        }); 
      });
    }  
  }

}

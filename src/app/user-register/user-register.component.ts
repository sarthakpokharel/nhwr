import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegistryService } from './user-register.service'

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  registerForm!: FormGroup;
  registerFormLayout!: any;
  model: any;
  hfo:any;
  constructor(private fb: FormBuilder, private rs: RegistryService, private ts: ToastrService) {

    this.registerFormLayout = {
      id: [""],
      username: ["", Validators.required],
      password: ["", [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'), Validators.required]],
      rpassword: ["", [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      surname: ["", Validators.required],
      firstname: ["", Validators.required],
      email: ["", [Validators.email, Validators.required]],
      mobile: [""],
      role: [null, Validators.required],
      province: [null],
      district: [null],

      municipality: [],
      ward: [],
      orgid: []
    }

    this.registerForm = fb.group(this.registerFormLayout)
  }

  formReset(){
    this.registerForm = this.fb.group(this.registerFormLayout)
  }

  ngOnInit(): void {
    this.rs.getProvinces().subscribe(
      (result: any) => {
        this.provinces = result.data;
      },
      error => {
        this.ts.error(error.error, 'Error');
      }
    );
  }

  swasthsSanstha = false;

  provinces: any;
  district: any;
  palika: any;
  ward: any;
  hf: any;

  getMunicipality(id: any) {
    this.rs.getpalika(id).subscribe(
      (result: any) => {
        this.palika = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.ts.error(error.error, 'Error');
      }
    );
  }

  getWard(mid: any) {
    this.rs.getWard(mid).subscribe(
      (result: any) => {
        this.ward = result.data;
        this.ward = this.ward[0].numberofward;
        var items: number[] = [];
        for (var i = 1; i <= this.ward; i++) {
          items.push(i);
        }
        this.ward = items;
      },
      error => {
        this.ts.error(error.error, 'Error');
      }
    );
  }

  getHf(pid: any) {
    this.rs.gethf(pid).subscribe(
      (result: any) => {
        this.hf = result.data;
        console.log(this.hf);
      },
      error => {
        this.ts.error(error.error, 'Error');
      }
    );
  }

  // palikaSelected(id: any) {
  //   this.getWard(id)
  // }

  districtSelected(id: any) {
    this.getMunicipality(id);
  }

  roles(roleid: any) {
    this.hf=[];
    $("#pro").hide();
    $("#dist").hide();
    $("#munc").hide();
    if(roleid=="Federal"){
     
      this.rs.getHfo(1).subscribe(
        (result: any) => {
          this.hf = result.data;
          // console.log(this.provinces);
        },
        error => {
          this.ts.error(error.error, 'Error');
        }
      );
    }
    if (roleid == "Province") {
      $("#pro").show();
    }
    if (roleid == "Local") {
      $("#pro").show();
      $("#dist").show();
      $("#munc").show();
      $("#orgs").hide();
    }
    if (roleid == "HF") {
      $("#pro").show();
      $("#dist").show();
      $("#munc").show();
      $("#orgs").show();
      this.swasthsSanstha = true;
      // this.registerForm.get('ward')?.setValidators(Validators.required);
      this.registerForm.get('municipality')?.setValidators(Validators.required);
      this.registerForm.get('orgid')?.setValidators(Validators.required);
    }
  }

  getOffices(pid:any){
    this.rs.getorgs(pid).subscribe(
      (result: any) => {
        this.hf = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.ts.error(error.error, 'Error');
      }
    );
  }

  submitForm() {

    if (this.registerForm.value.password == this.registerForm.value.rpassword) {
      if (this.registerForm.valid) {
        this.model = this.registerForm.value;
        this.createItem(this.registerForm.value.id);
      } else {
        Object.keys(this.registerForm.controls).forEach(field => {
          const singleFormControl = this.registerForm.get(field);
          singleFormControl!.markAsTouched({ onlySelf: true });
        });
      }
    }
    else {
      this.ts.error("Passwords must match","Password Error");
    }

  }


  createItem(id = null) {

    let upd = this.model;
    this.rs.create(upd).subscribe(result => {
      this.ts.success("Success");;
      this.registerForm = this.fb.group(this.registerFormLayout)
    }, error => {
      // console.log(error.error.message);
      this.ts.error(error.error);
    });
  }

  getDistricts(pid: any) {
    this.rs.getdistrict(pid).subscribe(
      (result: any) => {
        this.district = result.data;
        // console.log(this.provinces);
      },
      error => {
        this.ts.error(error.error, 'Error');
      }
    );
  }
  provinceSelected(id: any) {
    this.getDistricts(id);
  }

}

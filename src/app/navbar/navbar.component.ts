import { Component, OnInit } from '@angular/core';
import { LoginService } from '../admin-login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  islogedin:any;
  constructor(private ls: LoginService,private router:Router) { }

  ngOnInit(): void {
    this.getUserinfo();
  }

  getUserinfo(){
    if(this.ls.retriveUserData()==null){
      this.islogedin=0;
    }else{
      this.islogedin=1;
    }
    // console.log(this.ls.retriveUserData());
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

}

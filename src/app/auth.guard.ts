import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from './admin-login/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
	public jwtHelper = new JwtHelperService();
    constructor(private router: Router,private ls:LoginService) { }

    canActivate() {
        const udata = this.ls.retriveUserData();
        if (udata && !this.jwtHelper.isTokenExpired(udata.token)) {
            return true;
        }
        this.router.navigate(['/admin-login']);
        return false;
    }
}

@Injectable()
export class LoginGuard implements CanActivate {
    public jwtHelper = new JwtHelperService();
    constructor(private router: Router,private ls:LoginService) { }
    canActivate() {
        const udata = this.ls.retriveUserData();
        if (udata && !this.jwtHelper.isTokenExpired(udata.token)) {
            // logged in so return true
            this.router.navigate(['/mail/inbox']);
            return false;
        }
        return true;
    }
}

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot) {
      //  if (route.data.perm === 'abcd') {
         //   return true;
      //  }
        return true;
    }
}

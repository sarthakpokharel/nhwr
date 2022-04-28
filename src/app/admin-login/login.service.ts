import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { AppConfig } from "../app.config";

@Injectable()
export class LoginService {
    url = "auth/login";
    usrKey = "OASUSR";
    altToken = "token_bk";
    altUser = "user_bk";
    baseUrl: string = AppConfig.baseUrl;
    
    constructor(private api: ApiService, private router: Router,private http: HttpClient) { }

    login(data: any) {
        return this.api.post('sign-in', data);
    }

    storeUserData(data: any) {
        localStorage.setItem(this.usrKey, JSON.stringify(data));
    }

    retriveUserData() {
        const userInfo = localStorage.getItem(this.usrKey);
        if (userInfo != null) {
            try {
                return JSON.parse(userInfo);
            } catch (e) {
                return null;
            }

        }
        return null;
    }

    removeUserData() {
        if(!this.restoreUserLogin()){
            localStorage.removeItem(this.usrKey);
            return;
        }
    }

    loginWithAnotherUser(userId:string){
        return new Promise((resolve,reject)=>{
            const userData = this.retriveUserData();
            if(userData.hasOwnProperty(this.altUser) || userData.hasOwnProperty(this.altToken)){
                return reject(false);
            }
            this.api.post('get-user-token',{"userid":userId}).subscribe(data=>{
                if(data.hasOwnProperty('token') && data?.token!=''){
                    if(userData!=null){
                        const cuser = userData.user;
                        const ctoken = userData.token;
                        data[this.altUser] = cuser;
                        data[this.altToken] = ctoken;
                        this.storeUserData(data);
                        resolve(true);
                    }
                }
                reject(false);
            },err=>{
                reject(err);
            });
        });
    }

    restoreUserLogin(){
        const userData = this.retriveUserData();
        if(userData!=null){
            if(userData.hasOwnProperty(this.altUser) && userData.hasOwnProperty(this.altToken)){
                if( userData[this.altUser]!='' && userData[this.altToken]!=''){
                    const bkUser = userData[this.altUser];
                    const bkToken = userData[this.altToken];
                    this.storeUserData({"user":bkUser,"token":bkToken});
                    return true;
                }
            }
        }
        return false;
    }
    getuserinfo(){
        return this.http.get(this.baseUrl + 'mail/dispatch/getuserinfo');
    }
}

import { Injectable } from '@angular/core';
import {ApiService} from '../api.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, ROUTES } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { OfficeComponent } from './office.component';
import { AppConfig } from '../app.config';


@Injectable({
    providedIn: 'root' // just before your class
  })



export class OfficeService {
    baseUrl: string = AppConfig.baseUrl;
    url= this.baseUrl+'office';
    
constructor(private http: HttpClient) {}

   
    create(data: any) {
        // console.log(data);
        return this.http.post(this.url,data);
        
    }

    createpost(data:any){
        return this.http.post(this.url+'/addpost',data);
    }

    createDarbandi(data:any){
        return this.http.post(this.url+'/addDarbandi',data);
    }
    update(id: any, data: any) {
        return this.http.put(this.url + '/' + id, data);
        // return this.api.update(this.path,id,data);
    }

    getList(perPage: string | number, page: string | number, searchTerm?: string, sortKey?: string, sortDir?: boolean) {

        let urlPart = '?perPage=' + perPage + '&page=' + page;
        if (typeof searchTerm !== 'undefined' || searchTerm !== '') {
            urlPart += '&searchOption=all&searchTerm=' + searchTerm;
        }
        if (typeof sortKey !== 'undefined' || sortKey !== '') {
            urlPart += '&sortKey=' + sortKey;
        }
        if (typeof sortDir !== 'undefined' && sortKey !== '') {
            if (sortDir) {
                urlPart += '&sortDir=desc';
            } else {
                urlPart += '&sortDir=asc';
            }
        }
        return this.http.get(this.url + urlPart);
        
    }

    getListTree(id:any){
        return this.http.get(this.url+'/getTreelist?orgid='+id);
    }



    getEdit(id: string) {
        return this.http.get(this.url + '/' + id);
        
    }
    remove(id: string) {
        return this.http.delete(this.url + '/' + id);
        
    }
    removeEmp(id:any){
        return this.http.get(this.url + '/removeEmp/' + id);
    }

    removePost(wid:any,oid:any,did:any,detailsid:any){
        return this.http.get(this.url + '/removePost?wid='+wid+'&oid='+detailsid+'&did='+oid+'&detailsid='+did);
    }

    getOrglist(){
        return this.http.get(this.baseUrl+'subgroup/get-orgs');
    }
    getFilesHeader(hid: any){
        return this.http.get(this.baseUrl+'file-repo/get-file/'+hid);
    }

    uploadFile(data:any){
        return this.http.post(this.baseUrl+'file-repo/storefile',data);
    }

    getEmptype(){
        return this.http.get(this.baseUrl + 'subgroup/get-emptype');
      }

      getEthnicity(){
        return this.http.get(this.baseUrl + 'subgroup/get-ethincity');
      }
      getLevel(){
        return this.http.get(this.baseUrl + 'subgroup/get-level');
      }
      getcouncil(){
        return this.http.get(this.baseUrl + 'subgroup/get-council');
      }
      geteduLevel(){
        return this.http.get(this.baseUrl + 'subgroup/get-edulevel');
      }

      getQualification(eid:any,cid:any){
        return this.http.get(this.baseUrl + 'subgroup/get-qualification?eid='+eid+'&cid='+cid);
      }

      getemp(cno:any){
        return this.http.get(this.baseUrl + 'subgroup/get-emps?cno='+cno);
      }
      getEmpinfo(tid:any,empid:any){
        return this.http.get(this.baseUrl + 'subgroup/get-empinfo?empid='+empid);
      }
      getTransfer(wid:any){
        return this.http.get(this.baseUrl + 'subgroup/get-transfer?wid='+wid);
      }
      getSamuha() {
        return this.http.get(this.baseUrl + 'subgroup/get-samuha');
      }
     
      
      getSubgroup(gid:any){
        return this.http.get(this.baseUrl + 'subgroup/get-subgroup/'+gid);
      }
      getPost(gid:any){
        return this.http.get(this.baseUrl + 'subgroup/get-post/'+gid);
      }
   
}

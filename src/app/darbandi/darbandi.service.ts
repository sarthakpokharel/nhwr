import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class DarbandiService {
  constructor(private http: HttpClient) { }
  baseUrl: string = AppConfig.baseUrl;
  url= this.baseUrl+'registry';
  // url = 'http://localhost:8010/group';

  create(data: any) {
    // console.log(data);
    return this.http.post(this.url, data);

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

  getEdit(id: string) {
    return this.http.get(this.url + '/' + id);

  }
  remove(id: string) {
    return this.http.delete(this.url + '/' + id);

  }

  getProvinces() {
    return this.http.get(this.baseUrl + 'subgroup/get-provinces');
}

getOwnership() {
  return this.http.get(this.baseUrl + 'subgroup/get-ownership');
}

getHftype() {
  return this.http.get(this.baseUrl + 'subgroup/get-hftype');
}

getdistrict(pid:any) {
  return this.http.get(this.baseUrl + 'subgroup/get-district/'+pid);
}
getpalika(did:any) {
  return this.http.get(this.baseUrl + 'subgroup/get-palika/'+did);
}

getWard(mid:any) {
  return this.http.get(this.baseUrl + 'subgroup/get-ward/'+mid);
}
gethfDetails(hfid:any){
  return this.http.get(this.baseUrl + 'subgroup/get-hf-details/'+hfid);
}

gethf(mid:any,wn:any) {
  return this.http.get(this.baseUrl + 'subgroup/get-hf?mid='+mid+'&wn='+wn);
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

getEmptype(){
  return this.http.get(this.baseUrl + 'subgroup/get-emptype');
}
getLevel(){
  return this.http.get(this.baseUrl + 'subgroup/get-level');
}
getcouncil(){
  return this.http.get(this.baseUrl + 'subgroup/get-council');
}
}

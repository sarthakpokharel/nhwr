import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {
  constructor(private http: HttpClient) { }
  baseUrl: string = AppConfig.baseUrl;
  url = this.baseUrl + 'registry';
  // url = 'http://localhost:8010/group';

  create(data: any) {
    return this.http.post(this.baseUrl+'user-register/', data);
  }

  getProvinces() {
    return this.http.get(this.baseUrl + 'subgroup/get-provinces');
  }

  getdistrict(pid: any) {
    return this.http.get(this.baseUrl + 'subgroup/get-district/' + pid);
  }
  getpalika(did: any) {
    return this.http.get(this.baseUrl + 'subgroup/get-palika/' + did);
  }
  getWard(mid: any) {
    return this.http.get(this.baseUrl + 'subgroup/get-ward/' + mid);
  }
  
  gethf(mid:any) {
    return this.http.get(this.baseUrl + 'subgroup/get-hfbymunc?mid='+mid);
  }
  getHfo(gid:any){
    return this.http.get(this.baseUrl + 'subgroup/get-hfo/'+gid);
  }
  getorgs(pid:any){
    return this.http.get(this.baseUrl + 'subgroup/get-offices/'+pid);
  }
}

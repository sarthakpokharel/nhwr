import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) { }
  baseUrl: string = AppConfig.baseUrl;
  url= this.baseUrl+'report';
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
  getAdmlvl() {
    return this.http.get(this.baseUrl + 'subgroup/get-admlvl');
  }
  getProvinces() {
    return this.http.get(this.baseUrl + 'subgroup/get-provinces');
}

getHfo(gid:any){
  return this.http.get(this.baseUrl + 'subgroup/get-hfo/'+gid);
}
getorgs(pid:any){
  return this.http.get(this.baseUrl + 'subgroup/get-offices/'+pid);
}
gethf(mid:any) {
  return this.http.get(this.baseUrl + 'subgroup/get-hfbymunc?mid='+mid);
}
getdistrict(pid:any) {
  return this.http.get(this.baseUrl + 'subgroup/get-district/'+pid);
}
getpalika(did:any) {
  return this.http.get(this.baseUrl + 'subgroup/get-palika/'+did);
}
getReportview(orgtype:any,admlvl:any,pid:any,did:any,pal:any,hfid:any,ofc:any){
  return this.http.get(this.baseUrl + "registry/get-report-table?admid="+admlvl+"&pid="+pid+"&hfid="+hfid+"&did="+did+"&munc="+pal+"&ofc="+ofc+"&orgtype="+orgtype);
}
}

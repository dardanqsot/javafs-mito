import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { VitalSign } from '../model/vitalSign';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VitalSignService extends GenericService<VitalSign>{

  vitalSignChange: Subject<VitalSign[]> = new Subject<VitalSign[]>;
  messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/vitalsign`);
  }

  listarPageable(p: number, s: number) {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`, {
        headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
}
  ///////////////////////
  setVitalSignChange(data: VitalSign[]){
    this.vitalSignChange.next(data);
  }

  getVitalSignChange(){
    return this.vitalSignChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
  
}

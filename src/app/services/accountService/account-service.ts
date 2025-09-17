import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountData, LoginInfo } from '../../models/login-info.model';
import { of } from 'rxjs';
import { urlConstant } from '../../../constants';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private moduleUrl = urlConstant.apiUrl + urlConstant.accountModule;

  constructor(private http: HttpClient){}

  tryLogin(username: string, password: string){
    var loginUrl = this.moduleUrl + 'Login';
    var body = {
      Username: username,
      Password: password
    }
    return this.http.post<any>(loginUrl, body);
  }

  createNewAccount(username: string, password: string){
    var signUpUrl = this.moduleUrl + 'Create';
    var body = {
      Username: username,
      Password: password
    }
    return this.http.post<any>(signUpUrl, body);
  }

}

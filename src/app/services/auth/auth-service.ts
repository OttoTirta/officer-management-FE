import { Injectable } from '@angular/core';
import { LoginInfo } from '../../models/login-info.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router){}
  getLoginInfo(): LoginInfo | undefined {
    const token = localStorage.getItem('token');
    if(token == null){
      // this.logout();
      return undefined;
    }
    return jwtDecode(token);
  }

  isLoggedIn(): boolean{
    const loginInfo = this.getLoginInfo();
    return loginInfo != undefined;
  }

  getFullName(){
    return this.getLoginInfo()?.Username;
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}

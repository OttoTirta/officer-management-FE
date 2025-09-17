import { Component } from '@angular/core';
import { AccountService } from '../../services/accountService/account-service';
import { AccountData, LoginInfo } from '../../models/login-info.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationComponent } from "../shared/notification/notification";

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NotificationComponent
],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username: FormControl = new FormControl();
  password: FormControl = new FormControl();

  isFailedLogin = false;
  isLogin: boolean = true;
  isNotifShown: boolean = false;

  constructor(
    private accountService: AccountService,
    private router: Router
  ){
    this.activateFormValidation();
  }

  tryLogin(){
    this.isFailedLogin = false;
    this.accountService.tryLogin(this.username.value, this.password.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.Data.Token);
        this.router.navigateByUrl('/home');
      },
      error: () => {
        this.isFailedLogin = true;
      }
    });
  }

  activateFormValidation(){
    this.username.valueChanges.subscribe((uname: string) => {
      this.username.setErrors({
        tooShort: uname == null || uname.length < (this.isLogin ? 1 : 4)
      });
    });
  }

  getIsFormValid(){
    var isPasswordValid = (this.password.value?.length ?? 0) > 0;
    return !(this.username.getError('tooShort') ?? true) && isPasswordValid
  }

  createNewAccount(){
    this.accountService.createNewAccount(this.username.value, this.password.value).subscribe({
      next: (res) => {
        this.changeForm();
        this.showNotif();
        setTimeout(() => {
          this.closeNotif();
        }, 2000);
      },
      error: (err) => {
        console.log(err.message);
        
      }
    });
  }

  changeForm(){
    this.isLogin = !this.isLogin;
    this.username.reset();
    this.password.reset();
    this.isFailedLogin = false;
  }

  submitForm(){
    if (this.isLogin){
      this.tryLogin();
    }
    else{
      this.createNewAccount();
    }
  }

  showNotif(){
    this.isNotifShown = true;
  }
  closeNotif(){
    this.isNotifShown = false;
  }

}

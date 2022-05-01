import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./shared/login-page.service";

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./style/login-page-style.css']
})

export class LoginPageComponent implements OnInit{

  public loginFormGroup: FormGroup = this.fb.group({
    'user': new FormControl(null),
    'password': new FormControl(null)
  });
  public invalidLogin: boolean;
  constructor(
    private fb: FormBuilder,
    private loginService: AuthService,
    private router: Router
  ){}
  ngOnInit(): void {
  }

  public login(){
    this.loginService.checkLogin(this.loginFormGroup.value.user, this.loginFormGroup.value.password).subscribe(res => {
      localStorage.setItem("jwt", res.token);
      localStorage.setItem("idUser", res.idUser);
      localStorage.setItem("username", res.username);
      this.invalidLogin = false;
      this.router.navigate(["/"]);
    }, error => {
      this.invalidLogin = true;
    })
  }
}

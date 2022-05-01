import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './login-page/shared/login-page.service';
import { Values } from './shared/values';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'UniHelper';
  public loggedIn: boolean = false;
  public largeScreen: boolean = false;

  constructor(
    private authService : AuthService,
    private jwtHelperService: JwtHelperService,
    private router: Router
  ){}

  ngOnInit(): void {
      if(window.innerWidth > 900){
        this.largeScreen = true;
      }
      const token = localStorage.getItem("jwt");
      if(token && !this.jwtHelperService.isTokenExpired(token)){
        this.loggedIn = true;
      }
      else{
        this.router.navigate(["login"]);
      }
      this.authService.loggedIn.asObservable().subscribe((idUser: number) => {
        this.loggedIn = true;
      })
  }
}

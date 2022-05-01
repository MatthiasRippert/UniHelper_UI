import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UniHelperInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idUser = localStorage.getItem("idUser");
    const username = localStorage.getItem("username");
    if(idUser){
      const cloned = req.clone({
        headers: req.headers.set("User", idUser + ";" + username)
      });
      return next.handle(cloned);
    }
    else{
      return next.handle(req);
    }
  }
}

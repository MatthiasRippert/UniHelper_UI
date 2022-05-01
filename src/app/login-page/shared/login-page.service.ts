import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Values } from 'src/app/shared/values';

@Injectable()
export class AuthService {
  public loggedIn = new EventEmitter();
  constructor(
    private http: HttpClient
  ) { }

  public checkLogin(username: string, password: string){
    const credentials = {
      'username': username,
      'password': password,
      'sourceUrl': location.hostname == 'localhost' ? 'http://localhost:4200/' : 'https://uni-helper.de/'
    };

    return this.http.post(Values.getConnectionString() + 'Auth/Login', credentials).pipe(tap((res: any) => {
      if(res != null){
        this.loggedIn.emit(res.idUser);
      }
    }));
  }

}

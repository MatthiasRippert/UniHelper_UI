import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";

@Injectable()
export class NavigationService{
  constructor(
    private http: HttpClient
  ){}

  public getNavigation() {
    return this.http.get(Values.getConnectionString() + 'Navigation/GetNavigation');
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";

@Injectable()

export class ManageSubjectAreasService{
  constructor(
    private http: HttpClient
  ){}
  public getSubjectAreasWithSubject(idSubject: number){
    return this.http.get<any[]>(Values.getConnectionString() + `SubjectArea/GetSubjectAreasWithSubject?idSubject=${idSubject}`);
  }

  public deleteSubjectArea(idSubjectArea: number){
    return this.http.delete<boolean>(Values.getConnectionString() + `SubjectArea/DeleteSubjectArea?idSubjectArea=${idSubjectArea}`);
  }

  public getSubjectAreaBySearchText(idSubject: number, searchText: string){
    return this.http.get<any[]>(Values.getConnectionString() + `SubjectArea/GetSubjectAreaBySearchText?idSubject=${idSubject}&searchText=${searchText}`);
  }
}

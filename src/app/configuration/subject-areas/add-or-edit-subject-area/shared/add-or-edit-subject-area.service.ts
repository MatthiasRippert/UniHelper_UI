import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";

@Injectable()

export class AddOrEditSubjectAreaService{
  constructor(
    private http: HttpClient
  ){}
  public addSubjectArea(idSubject: number, subjectArea: string){
    let body = {
      idSubject: idSubject,
      subjectArea: subjectArea
    }
    return this.http.post<boolean>(Values.getConnectionString() + 'SubjectArea/AddSubjectArea', body);
  }

  public getSubjectAreaById(idSubjectArea: number){
    return this.http.get<any>(Values.getConnectionString() + `SubjectArea/GetSubjectAreaById?idSubjectArea=${idSubjectArea}`);
  }

  public updateSubjectArea(idSubjectArea: number, idSubject: number, descriptionSubjectArea: string){
    let body = {
      idSubjectArea: idSubjectArea,
      idSubject: idSubject,
      descriptionSubjectArea: descriptionSubjectArea
    };
    return this.http.post(Values.getConnectionString() + 'SubjectArea/UpdateSubjectArea', body);
  }
}

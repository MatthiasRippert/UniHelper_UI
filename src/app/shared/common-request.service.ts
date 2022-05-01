import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ISubject } from "../configuration/questions/manage-questions/manage-questions.component";
import { Values } from "./values";

@Injectable()

export class CommonRequestService{

  constructor(
    private http: HttpClient
  ){}

  public getSubjectAreas(idSubject: number){
    return this.http.get<any[]>(Values.getConnectionString() + `SubjectArea/GetSubjectAreas?idSubject=${idSubject}`);
  }

  public getSubjects(){
    return this.http.get<ISubject[]>(Values.getConnectionString() + 'Subject/GetSubjects');
  }

  public getVocabularySubjects(){
    return this.http.get<any[]>(Values.getConnectionString() + 'Subject/GetVocabularySubjects');
  }
}

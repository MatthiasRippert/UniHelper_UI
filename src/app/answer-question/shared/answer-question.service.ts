import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";

@Injectable()

export class AnswerQuestionService{
  constructor(
    private http: HttpClient
  ){}

  public getSubjects(){
    return this.http.get<any[]>(Values.getConnectionString() + 'Subject/GetSubjects')
  }

  public getSubjectAreas(idSubject: number){
    return this.http.get<any[]>(Values.getConnectionString() + `SubjectArea/GetSubjectAreas?idSubject=${idSubject}`);
  }

  public getQuestionToAnswer(prioFrom: number, prioTo: number, idSubject: number, idSubjectArea: number){
    return this.http.get<any[]>(Values.getConnectionString() + `Question/GetQuestionToAnswer?prioFrom=${prioFrom}&prioTo=${prioTo}&idSubject=${idSubject}&idSubjectArea=${idSubjectArea}`);
  }
}

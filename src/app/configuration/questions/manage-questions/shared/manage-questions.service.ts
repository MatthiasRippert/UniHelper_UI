import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";
import { IQuestion } from "../manage-questions.component";

@Injectable()

export class ManageQuestionsService{
  constructor(
    private http: HttpClient
  ){}

  public getQuestions(idSubject: number, idSubjectArea: number){
    return this.http.get<IQuestion[]>(Values.getConnectionString() + `Question/GetQuestions?idSubject=${idSubject}&idSubjectArea=${idSubjectArea}`);
  }

  public getQuestionsByText(idSubject: number, question: string, idSubjectArea: number){
    return this.http.get<any[]>(Values.getConnectionString() + `Question/GetQuestionsByText?IdSubject=${idSubject}&question=${question}&idSubjectArea=${idSubjectArea}`);
  }

  public deleteQuestion(idQuestion: number){
    return this.http.delete(Values.getConnectionString() + `Question/DeleteQuestion?idQuestion=${idQuestion}`);
  }
}

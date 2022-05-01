import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IGetQuestionsRequest, IQuestion } from "src/app/interfaces/interfaces";
import { Values } from "src/app/shared/values";

@Injectable()

export class ManageQuestionsService{
  constructor(
    private http: HttpClient
  ){}

  public getQuestions(idSubject: number, idsSubjectArea: number[], searchText: string){
    const body = <IGetQuestionsRequest> {
      idSubject: idSubject,
      idsSubjectArea: idsSubjectArea,
      searchText: searchText
    }
    return this.http.post<IQuestion[]>(Values.getConnectionString() + `Question/GetQuestions`, body);
  }

  public deleteQuestion(idQuestion: number){
    return this.http.delete(Values.getConnectionString() + `Question/DeleteQuestion?idQuestion=${idQuestion}`);
  }
}

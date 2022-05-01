import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IGetQuestionToAnswerRequest } from "src/app/interfaces/interfaces";
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

  public getQuestionToAnswer(prioFrom: number, prioTo: number, idSubject: number, idSubjectAreas: number[], orderByLastTimeAnswered: boolean){
    const body = <IGetQuestionToAnswerRequest> {
      prioFrom: prioFrom,
      prioTo: prioTo,
      idSubject: idSubject,
      idSubjectAreas: idSubjectAreas,
      orderByLastTimeAnswered: orderByLastTimeAnswered
    }
    return this.http.post<any>(Values.getConnectionString() + `Question/GetQuestionToAnswer`, body);
  }

  public adjustPrioOfQuestion(idQuestion: number, answeredCorrectly: boolean){
    let body = {
      idQuestion: idQuestion,
      answeredCorrectly: answeredCorrectly
    };
    return this.http.post(Values.getConnectionString() + `Question/AdjustQuestionPrio`, body);
  }

  public setLastTimeAnswered(idQuestion: number)
  {
    let body = {
      idQuestion: idQuestion
    };
    return this.http.post(Values.getConnectionString() + 'Question/SetLastTimeAnswered', body);
  }

  public checkIfAnswerIsCorrect(idQuestion: number, answer: string){
    return this.http.get(Values.getConnectionString() + `Question/CheckIfAnswerIsCorrect?idQuestion=${idQuestion}&answer=${answer}`);
  }

  public addAnswerToRightAnswers(idQuestion: number, answer: string){
    let body = {
      idQuestion: idQuestion,
      answer: answer
    }
    return this.http.post(Values.getConnectionString() + 'Question/AddAnswerToRightAnswers', body);
  }

  public addAnswerToWrongAnswers(idQuestion: number, answer: string){
    let body = {
      idQuestion: idQuestion,
      answer: answer
    };
    return this.http.post(Values.getConnectionString() + 'Question/AddAnswerToWrongAnswers', body);
  }
}

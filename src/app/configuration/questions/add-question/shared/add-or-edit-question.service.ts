import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";

@Injectable()
export class ConfigurationAddQuestionService{
  constructor(
    private http: HttpClient
  ){}

  public getSubjects(){
    return this.http.get<any[]>(Values.getConnectionString() + 'Subject/GetSubjects');
  }

  public getSubjectAreas(idSubject: number = 0){
    var queryParams = '';
    if(idSubject != 0){
      queryParams = `?idSubject=${idSubject}`;
    }
    return this.http.get<any[]>(Values.getConnectionString() + `SubjectArea/GetSubjectAreas${queryParams}`);
  }

  public saveQuestion(idSubject: number, idSubjectArea: number, prio: number, question: string, idQuestionType: number, answers: string[], multipleChoiceRightAnswer: number){
    let body = {
      IdSubject: idSubject,
      IdSubjectArea: idSubjectArea,
      Prio: +prio,
      Question: question,
      IdQuestionType: idQuestionType,
      Answers: answers,
      NumberRightAnswer: multipleChoiceRightAnswer
    };

    return this.http.post(Values.getConnectionString() + 'Question/SaveQuestion', body);
  }

  public getQuestionById(idQuestion: number){
    return this.http.get<any[]>(Values.getConnectionString() + `Question/GetQuestionById?idQuestion=${idQuestion}`);
  }

  public deleteQuestion(idQuestion: number){
    return this.http.delete(Values.getConnectionString() + `Question/DeleteQuestion?idQuestion=${idQuestion}`);
  }
}

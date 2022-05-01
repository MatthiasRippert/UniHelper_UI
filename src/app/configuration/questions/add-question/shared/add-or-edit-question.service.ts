import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";

@Injectable()
export class ConfigurationAddQuestionService{
  constructor(
    private http: HttpClient
  ){}

  public saveQuestion(idSubject: number, idSubjectArea: number, prio: number, question: string, questionImage: string, idQuestionType: number, answers: any[], multipleChoiceRightAnswer: number){
    let body = {
      IdSubject: idSubject,
      IdSubjectArea: idSubjectArea,
      Prio: +prio,
      Question: question,
      QuestionImage: questionImage,
      IdQuestionType: idQuestionType,
      Answers: answers,
      NumberRightAnswer: multipleChoiceRightAnswer
    };

    return this.http.post(Values.getConnectionString() + 'Question/SaveQuestion', body);
  }

  public updateQuestion(idQuestion: number, idSubject: number, idSubjectArea: number, prio: number, question: string, questionImage: string, idQuestionType: number, multipleChoiceRightAnswer: number, newAnswers: string[], oldAnswers: any[]){
    let body = {
      idQuestion: idQuestion,
      IdSubject: idSubject,
      IdSubjectArea: idSubjectArea,
      Prio: +prio,
      Question: question,
      QuestionImage: questionImage,
      IdQuestionType: idQuestionType,
      NumberRightAnswer: multipleChoiceRightAnswer,
      NewAnswers: newAnswers,
      OldAnswers: oldAnswers
    };

    return this.http.post(Values.getConnectionString() + 'Question/UpdateQuestion', body);
  }

  public getQuestionById(idQuestion: number){
    return this.http.get<any[]>(Values.getConnectionString() + `Question/GetQuestionById?idQuestion=${idQuestion}`);
  }

  public deleteQuestion(idQuestion: number){
    return this.http.delete(Values.getConnectionString() + `Question/DeleteQuestion?idQuestion=${idQuestion}`);
  }

  public deleteAnswer(idAnswer: number){
    return this.http.delete(Values.getConnectionString() + `Question/DeleteAnswer?idAnswer=${idAnswer}`);
  }

  public deleteAllAnswersFromQuestion(idQuestion: number){
    return this.http.delete(Values.getConnectionString() + `Question/DeleteAllAnswersFromQuestion?idQuestion=${idQuestion}`);
  }

  public addNewAnswersToQuestion(idQuestion: number, answers: string[]){
    let body = {
      idQuestion: idQuestion,
      answers: answers
    }
    return this.http.post(Values.getConnectionString() + 'Question/AddNewAnswersToQuestion', body);
  }

  public getAnswers(idQuestion: number){
    return this.http.get<any[]>(Values.getConnectionString() + `Question/GetAnswers?idQuestion=${idQuestion}`);
  }

  public getSuggestedQuestions(idSubject: number, idSubjectArea: number){
    return this.http.get<any[]>(Values.getConnectionString() + `Question/GetSuggestedQuestions?idSubject=${idSubject}&idSubjectArea=${idSubjectArea}`);
  }
}

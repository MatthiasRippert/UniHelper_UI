import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Values } from "src/app/shared/values";

@Injectable()

export class AnswerVocabularyService{
  constructor(
    private http: HttpClient
  ){}

  public getVocabularyToAnswer(prioFrom: number, prioTo: number, idSubject: number, orderByLastTimeAnswered: boolean){
    return this.http.get<any>(Values.getConnectionString() + `Vocabulary/GetVocabularyToAnswer?prioFrom=${prioFrom}&prioTo=${prioTo}&idSubject=${idSubject}&orderByLastTimeAnswered=${orderByLastTimeAnswered}`);
  }

  public checkIfAnswerIsCorrect(idVocabulary: number, translation: string){
    return this.http.get<boolean>(Values.getConnectionString() + `Vocabulary/CheckIfAnswerIsCorrect?idVocabulary=${idVocabulary}&translation=${translation}`);
  }

  public adjustPrioOfVocabulary(idVocabulary: number, answeredCorrectly: boolean){
    let body = {
      idVocabulary: idVocabulary,
      answeredCorrectly: answeredCorrectly
    }
    return this.http.post(Values.getConnectionString() + 'Vocabulary/AdjustPrioOfVocabulary', body)
  }
}

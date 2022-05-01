import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";
import { ITranslation } from "../add-or-edit-vocabulary.component";

@Injectable()

export class AddOrEditVocabularyService{
  constructor(
    private http: HttpClient
  ){}

  public saveVocabulary(idSubject: number, vocabulary: string, prio: number, translations: string[]){
    let body = {
      idSubject: idSubject,
      vocabulary: vocabulary,
      prio: prio,
      translations: translations
    };

    return this.http.post(Values.getConnectionString() + 'Vocabulary/SaveVocabulary', body);
  }

  public getVocabularyFromId(idVocabulary: number){
    return this.http.get<any>(Values.getConnectionString() + `Vocabulary/GetVocabularyFromId?idVocabulary=${idVocabulary}`);
  }

  public deleteVocabularyTranslation(idTranslation: number){
    return this.http.delete(Values.getConnectionString() + `Vocabulary/DeleteVocabularyTranslation?idTranslation=${idTranslation}`);
  }
  public updateVocabulary(idVocabulary: number, vocabulary: string, prio: number, idSubject: number, oldTranslations: ITranslation[], newTranslations: string[]){
    let body = {
      idVocabulary: idVocabulary,
      idSubject: idSubject,
      vocabulary: vocabulary,
      prio: prio,
      oldTranslations: oldTranslations,
      newTranslations: newTranslations
    };

    return this.http.post(Values.getConnectionString() + 'Vocabulary/UpdateVocabulary', body)
  }
}

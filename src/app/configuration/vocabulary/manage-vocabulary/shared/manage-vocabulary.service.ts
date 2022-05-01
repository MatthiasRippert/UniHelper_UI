import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";

@Injectable()

export class ManageVocabularyService{
  constructor(
    private http: HttpClient
  ){}

  public getVocabulary(idSubject: number, searchText: string){
    return this.http.get<any[]>(Values.getConnectionString() + `Vocabulary/GetVocabulary?idSubject=${idSubject}&searchText=${searchText}`);
  }

  public deleteVocabulary(idVocabulary: number){
    return this.http.delete(Values.getConnectionString() + `Vocabulary/DeleteVocabulary?idVocabulary=${idVocabulary}`);
  }
}

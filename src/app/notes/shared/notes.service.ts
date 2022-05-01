import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Values } from "src/app/shared/values";

@Injectable()

export class NoteService{
  constructor(
    private http: HttpClient
  ){}

  public getNotes(idSubject: number, idSubjectArea: number){
    return this.http.get<any[]>(Values.getConnectionString() + `Note/GetNotes?idSubject=${idSubject}&idSubjectArea=${idSubjectArea}`);
  }
  public getTextFromNote(idNote: number){
    return this.http.get<any>(Values.getConnectionString() + `Note/GetTextFromNote?idNote=${idNote}`);
  }
  public saveNote(idSubject: number, idSubjectArea: number, noteTitle: string, noteText: string){
    let body = {
      idSubject: idSubject,
      idSubjectArea: idSubjectArea,
      noteTitle: noteTitle,
      noteText: noteText,
      createdBy: 'matze' //TODO: Ersetzen durch angemeldeten User
    };

    return this.http.post<number>(Values.getConnectionString() + 'Note/SaveNote', body);
  }
  public saveQuestionsInNote(idNote: number, noteText: string, idSubject: number, idSubjectArea: number){
    let body = {
      idNote: idNote,
      noteText: noteText,
      idSubject: idSubject,
      idSubjectArea: idSubjectArea
    };
    return this.http.post(Values.getConnectionString() + 'Note/SaveQuestionsInNote', body)
  }

  public updateNote(idNote: number, noteTitle: string, noteText: string){
    let body = {
      idNote: idNote,
      noteTitle: noteTitle,
      noteText: noteText
    };

    return this.http.post(Values.getConnectionString() + 'Note/UpdateNote', body);
  }

  public deleteNote(idNote: number){
    return this.http.delete(Values.getConnectionString() + `Note/DeleteNote?idNote=${idNote}`);
  }
}

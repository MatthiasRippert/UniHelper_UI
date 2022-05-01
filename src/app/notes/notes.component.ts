import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { jqxComboBoxComponent } from "jqwidgets-ng/jqxcombobox";
import { mergeMap } from "rxjs/operators";
import { CommonRequestService } from "../shared/common-request.service";
import { NoteService } from "./shared/notes.service";

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html'
})

export class NotesComponent implements OnInit{
  @ViewChild('subjectAreaComboBox') subjectAreaComboBox: jqxComboBoxComponent;

  public notes: any[] = [];
  public noteTitle: string;
  public noteText: string;

  public loading: boolean;

  public selectedSubject: any;
  public subjects: any[] = [];
  public idSubject: number;

  public subjectAreas: any[];
  public subjectAreaForDropdown: string[] = [];
  public selectedSubjectArea: string = '';

  public showNote: boolean = false;

  public editMode: boolean = false;

  private noteIdOfEditedNote: number;

  public showDeleteAlert: boolean = false;

  constructor(
    private noteService: NoteService,
    private commonRequestService: CommonRequestService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['idSubject'] && +params['idSubject'] > 0){
        this.idSubject = +params['idSubject'];
      }
      this.getSubjects();
    })
  }

  private getSubjects(){
    this.commonRequestService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
      this.selectedSubject = this.idSubject != null ? this.subjects.find(f => f.idSubject == this.idSubject) : this.subjects[0];
      this.getNotes();
      this.getSubjectAreas();
    })
  }

  private getNotes(){
    let idSubjectArea = this.selectedSubjectArea == '' ? 0 : this.subjectAreas.find(f => f.descriptionSubjectArea == this.selectedSubjectArea).idSubjectArea;
    this.noteService.getNotes(this.selectedSubject.idSubject, idSubjectArea).subscribe(notes => {
      this.notes = notes;
    });
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
    this.selectedSubjectArea = '';
    this.getNotes();
    this.getSubjectAreas();
  }

  private getSubjectAreas(){
    this.commonRequestService.getSubjectAreas(this.selectedSubject.idSubject).subscribe(areas => {
      this.subjectAreas = areas;
      this.subjectAreaForDropdown = [];
      this.subjectAreas.forEach(area => {
        this.subjectAreaForDropdown.push(area.descriptionSubjectArea);
      });
    })
  }

  public subjectAreaValueChange(){
    this.selectedSubjectArea = this.subjectAreaComboBox.getSelectedItem().value;
    this.getNotes();
  }

  public saveNote(){
    this.loading = true;
    let idSubjectArea = this.subjectAreas.find(f => f.descriptionSubjectArea == this.selectedSubjectArea).idSubjectArea;

    if(!this.editMode){
      return this.noteService.saveNote(this.selectedSubject.idSubject, idSubjectArea, this.noteTitle, this.noteText).pipe(mergeMap(idNote => {
        return this.noteService.saveQuestionsInNote(idNote, this.noteText, this.idSubject, idSubjectArea)
      })).subscribe(() => {
        this.loading = false;
        this.getNotes();
        this.showNote = false;
      }, error => {
        console.error(error);
        this.loading = false;
      })
    }
    else{
      return this.noteService.updateNote(this.noteIdOfEditedNote, this.noteTitle, this.noteText).pipe(mergeMap(() => {
        return this.noteService.saveQuestionsInNote(this.noteIdOfEditedNote, this.noteText, this.idSubject, idSubjectArea)
      })).subscribe(() => {
        this.loading = false;
        this.getNotes();
        this.showNote = false;
      }, error => {
        console.error(error);
        this.loading = false;
      })
    }
  }

  public noteSelected(note: any){
    this.noteService.getTextFromNote(note.idNote).subscribe(res => {
      this.noteTitle = note.noteTitle;
      this.noteText = res.noteText;
      this.noteIdOfEditedNote = note.idNote;
      this.showNote = true;
      this.editMode = true;
    });
  }

  public deleteQuestion(){
    this.noteService.deleteNote(this.noteIdOfEditedNote).subscribe(() => {
      this.showNote = false;
      this.showDeleteAlert = false;
      this.getNotes();
    }, error => {
      console.error(error);
    })
  }

}

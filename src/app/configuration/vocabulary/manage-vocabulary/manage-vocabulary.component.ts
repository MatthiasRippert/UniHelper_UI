import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonRequestService } from "src/app/shared/common-request.service";
import { ManageVocabularyService } from "./shared/manage-vocabulary.service";

@Component({
  selector: 'manage-vocabulary',
  templateUrl: './manage-vocabulary.component.html'
})

export class ManageVocabularyComponent implements OnInit{
  public vocabularySearchText: string = '';

  public selectedSubject: any;
  public subjects: any[] = [];

  public vocabulary: any[] = [];

  public showDeleteQuestionAlert: boolean = false;
  public vocabularyToDelete: any;

  public currentPage: number = 1;
  private pageSize: number = 8;
  public pages: number = 0;

  constructor(
    private commonRequestService: CommonRequestService,
    private vocabularyService: ManageVocabularyService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.getSubjects();
    this.getVocabulary(0);
  }

  private getSubjects(){
    this.commonRequestService.getVocabularySubjects().subscribe(res => {
      this.subjects.push({
        idSubject: 0,
        description: 'Alle Fächer',
        vocabulary: true
      });
      this.selectedSubject = this.subjects[0];
      res.forEach(r => {
        this.subjects.push({
          idSubject: r.idSubject,
          description: r.description,
          vocabulary: r.vocabulary
        });
      });
    })
  }

  public subjectChanged(subject: any){
    this.selectedSubject =  subject;
    this.getVocabulary(0);
  }

  public getVocabulary(from: number){
    let idSubject = this.selectedSubject == null ? 0 : this.selectedSubject.idSubject;
    this.vocabularyService.getVocabulary(idSubject, this.vocabularySearchText).subscribe(vocabulary => {
      this.pages = Math.ceil(vocabulary.length / this.pageSize);
      this.vocabulary = [];
      for(var i = from; i < from + this.pageSize && i < vocabulary.length; i++){
        this.vocabulary.push(vocabulary[i]);
      }
    })
  }

  public vocabularyClicked(vocabulary: any){
    let queryParams = {
      idVocabulary: vocabulary.idVocabulary
    };
    this.router.navigate(['/configuration/manageVocabulary/addOrEditVocabulary'], {queryParams: queryParams});
  }

  public showDeleteVocabularyAlertClick(vocabulary: any){
    this.vocabularyToDelete = vocabulary;
    this.showDeleteQuestionAlert = true;
  }

  public closeDeleteVocabularyAlert(){
    this.showDeleteQuestionAlert = false;
  }

  public deleteVocabulary(){
    this.vocabularyService.deleteVocabulary(this.vocabularyToDelete.idVocabulary).subscribe(() => {
      this.getVocabulary(this.getFromIndexForPage());
      this.showDeleteQuestionAlert = false;
    })
  }

  public getNextVocabulary(nextPage: boolean){
    if(nextPage && this.currentPage + 1 <= this.pages){
      this.currentPage++;
      this.getVocabulary(this.getFromIndexForPage());
    }
    else if(!nextPage && this.currentPage - 1 > 0){
      this.currentPage--;
      this.getVocabulary(this.getFromIndexForPage());
    }
  }

  private getFromIndexForPage(){
    return (this.currentPage - 1) * this.pageSize;
  }
}

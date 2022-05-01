import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonRequestService } from "src/app/shared/common-request.service";
import { AddOrEditVocabularyService } from "./shared/add-or-edit-vocabulary.service";

export interface ITranslation{
  idTranslation: number,
  translation: string,
  newTranslation: boolean
}
@Component({
  selector: 'add-or-edit-vocabulary',
  templateUrl: './add-or-edit-vocabulary.component.html'
})

export class AddOrEditVocabularyComponent implements OnInit{
  public title: string =  'Vokabel hinzufügen'
  public selectedSubject: any;
  public subjects: any[] = [];

  public selectedPrio: number = 5;

  public vocabulary: string;

  public translations: ITranslation[] = [{idTranslation: 1, translation: '', newTranslation: true}];

  public vocabularyToEdit: any;
  constructor(
    private commonRequestService: CommonRequestService,
    private vocabularyService: AddOrEditVocabularyService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['idVocabulary'] && params['idVocabulary'] > 0){
        this.vocabularyService.getVocabularyFromId(+params['idVocabulary']).subscribe(voc => {
          this.vocabularyToEdit = voc;
          this.vocabulary = this.vocabularyToEdit.vocabulary;
          this.selectedPrio = this.vocabularyToEdit.prio;
          this.addTranslationsFromVocabularyToEdit();
        })
      }
    })
    this.getSubjects();
  }

  private getSubjects(){
    this.commonRequestService.getVocabularySubjects().subscribe(subjects => {
      this.subjects = subjects;
      if(this.vocabularyToEdit != null){
        this.selectedSubject = this.subjects.find(f => f.idSubject == this.vocabularyToEdit.idSubject);
      }
      else{
        this.selectedSubject = this.subjects[0];
      }
    })
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
  }

  private addTranslationsFromVocabularyToEdit(){
    this.translations = [];
    this.vocabularyToEdit.translations.forEach((translation: any) => {
      this.translations.push({
        idTranslation: translation.idTranslation,
        translation: translation.translation,
        newTranslation: false
      });
    });
  }

  public prioRangeChanged(value: number){
    this.selectedPrio = value;
  }

  public addTranslation(){
    let idTranslation = this.translations[this.translations.length - 1].idTranslation + 1;
    this.translations.push({
      idTranslation: idTranslation,
      translation: '',
      newTranslation: true
    });
  }

  public removeTranslation(translation: ITranslation){
    let index = this.translations.findIndex(f => f.idTranslation == translation.idTranslation);
    if(index > -1){
      if(this.vocabularyToEdit != null){
        this.vocabularyService.deleteVocabularyTranslation(this.translations[index].idTranslation).subscribe(() => {
          this.translations.splice(index, 1);
        });
      }
      else{
        this.translations.splice(index, 1);
      }
    }
  }
  public saveVocabulary(){
    if(this.vocabularyToEdit == null){
      this.vocabularyService.saveVocabulary(this.selectedSubject.idSubject, this.vocabulary, +this.selectedPrio, this.translations.map(m => m.translation)).subscribe(() => {
        this.vocabulary = '';
        this.translations = [];
        this.translations.push({idTranslation: 1, translation: '', newTranslation: true});
        this.selectedPrio = 5;
      });
    }
    else{
      let oldAnswers = this.translations.filter(f => !f.newTranslation).map(m => {
        var newObj: any = {idTranslation: 0, translation: ''};
        newObj['idTranslation']=m.idTranslation;
        newObj['translation']=m.translation;
        return newObj;
      })
      this.vocabularyService.updateVocabulary(
        this.vocabularyToEdit.idVocabulary,
        this.vocabulary, +this.selectedPrio,
        this.selectedSubject.idSubject,
        oldAnswers,
        this.translations.filter(f => f.newTranslation).map(m => m.translation)).subscribe(() => {
        this.router.navigate(['configuration/manageVocabulary']);
      })
    }
  }
}

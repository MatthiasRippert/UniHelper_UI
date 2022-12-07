import { query } from "@angular/animations";
import { Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { Router } from "@angular/router";
import { request } from "http";
import { combineLatest, defer, forkJoin, from, Observable, of, throwError } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, tap } from "rxjs/operators";
import { IQuestion, ISubject, ISubjectArea } from "src/app/interfaces/interfaces";
import { CommonRequestService } from "src/app/shared/common-request.service";
import { ShowImageInFullScreenComponent } from "src/app/shared/show-image-in-full-screen/show-image-in-full-screen.component";
import { ManageQuestionsService } from "./shared/manage-questions.service";

@Component({
  selector: 'configuration-manage-questions',
  templateUrl: './manage-questions.component.html'
})

export class ConfigurationManageQuestionsComponent implements OnInit{
  @ViewChild('showImageComponent') showImageComponent: ShowImageInFullScreenComponent;
  selectedSubject: any;
  subjects: ISubject[] = [];
  questions$ = new Observable<IQuestion[]>();

  private questions: string[] = [];
  filteredQuestions: string[] = [];

  questionSearchText: string = '';

  subjectAreas: ISubjectArea[];
  selectedSubjectAreas: ISubjectArea[] = [];

  showDeleteQuestionAlert: boolean;
  questionToDelete: any;

  questionsLoading = true;

  private searchTextChanged = new EventEmitter();

  smallScreen = false;
  constructor(
    private questionService: ManageQuestionsService,
    private router: Router,
    private commonRequestService: CommonRequestService,
    private firebaseService: AngularFireStorage
  ){}
  ngOnInit(): void {
    if(window.innerWidth < 900){
      this.smallScreen = true;
    }
    this.getSubjects();

    this.searchTextChanged.asObservable().pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(text => {
        this.questionSearchText = text;
        this.getQuestions();
      })
    ).subscribe();
  }

  private getSubjects(){
    this.commonRequestService.getSubjects().subscribe(res => {
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
      this.getSubjectAreas();
    })
  }
  private getSubjectAreas(){
    this.commonRequestService.getSubjectAreas(this.selectedSubject.idSubject).subscribe(areas => {
      this.subjectAreas = areas;
      this.getQuestions()
    })
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
    this.getSubjectAreas();
  }
  getQuestions(){
    this.questionsLoading = true;
    const idsSubjectArea = this.selectedSubjectAreas.map(m => m.idSubjectArea);;
    let getQuestionRequest$ = this.questionService.getQuestions(this.selectedSubject.idSubject, idsSubjectArea, this.questionSearchText);
    this.questions$ = getQuestionRequest$.pipe(
      mergeMap(questions => {
        this.questions = questions.map(m => m.question);
        this.filteredQuestions = this.questions;
        if(questions.filter(f => f.questionImage != null && f.questionImage != '').length > 0){
          return this.getImageUrls(questions).pipe(map(urls => {
            return {questions, urls};
          }));
        }else{
          return of({questions, urls: []})
        }
      }),
      map((res: any) => this.fillQuestions(res.questions, res.urls)),
      catchError(err => {
        console.error(err);
        this.questionsLoading = false;
        return throwError(err);
      })
    );
  }
  private getImageUrls(questions: IQuestion[]): Observable<any[]> {
    const imageRequests: Observable<any>[] = [];
    questions.forEach(q => {
      if (q.questionImage != null && q.questionImage != '') {
        imageRequests.push(defer(() => from(this.firebaseService.ref(q.questionImage).getDownloadURL())));
      }
    })
    return forkJoin(imageRequests);
  }

  private fillQuestions(questions: IQuestion[], imageUrls: string[]): IQuestion[] {
    const ret: IQuestion[] = [];
    questions.forEach((q: IQuestion) => {
      ret.push({
        idQuestion: q.idQuestion,
        idQuestionType: q.idQuestionType,
        createdAt: q.createdAt,
        idSubject: q.idSubject,
        subject: this.subjects.find(f => f.idSubject == q.idSubject)?.description ?? '',
        idSubjectArea: q.idSubjectArea,
        subjectArea: this.subjectAreas.find(f => f.idSubjectArea == q.idSubjectArea)?.descriptionSubjectArea ?? '',
        prio: q.prio,
        question: q.question,
        questionImage: this.setQuestionImageDownloadUrl(q, imageUrls)
      })
    });
    this.questionsLoading = false;

    return ret;
  }

  private setQuestionImageDownloadUrl(question: IQuestion, imageUrls: string[]): string{

    if(question.questionImage != null && question.questionImage != ''){
       const index = imageUrls.findIndex(url => url.includes(question.questionImage));
       if(index > -1){
         return imageUrls[index];
       }
    }
    return '';
  }

  public subjectAreaValueChange(subjectArea: any){
    this.getQuestions();
  }
  public questionClicked(question: any){
    var queryParams = {
      idQuestion: question.idQuestion
    };

    this.router.navigate(['configuration', 'manageQuestions', 'createOrEditQuestion'], { queryParams: queryParams });
  }

  public showDeleteQuestionAlertClick(question: any){
    this.questionToDelete = question;
    this.showDeleteQuestionAlert = true;
  }

  public deleteQuestion(){
    this.questionService.deleteQuestion(this.questionToDelete.idQuestion).subscribe(() => {
      this.getQuestions();
      this.closeDeleteQuestionAlert();
    })
  }

  public closeDeleteQuestionAlert(){
    this.showDeleteQuestionAlert = false;
  }

  public imageClicked(image: string){
    this.showImageComponent.showImageInFullScreen(image);
  }

  public onSearchTextChanged(text: any){
    this.searchTextChanged.emit(text);
  }

  public filterQuestions(event: any): void {
    this.filteredQuestions = this.questions.filter(question => question.toLowerCase().includes(event.query.toLowerCase()));
    console.log(this.filteredQuestions);
  }

}

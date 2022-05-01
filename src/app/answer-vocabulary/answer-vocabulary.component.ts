import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { interval, Subscription } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { CommonRequestService } from "../shared/common-request.service";
import { AnswerVocabularyService } from "./shared/answer-vocabulary.service";

@Component({
  selector: 'answer-vocabulary',
  templateUrl: './answer-vocabulary.component.html'
})

export class AnswerVocabularyComponent implements OnInit{
  public selectedSubject: any;
  public subjects: any[];

  private idSubjectFromQueryParams: number;

  public prioFrom: number = 1;
  public prioTo: number = 10;

  public answer: string;

  public noVocabularyFound: boolean = false;
  public vocabularyAnsweredCorrectly: boolean = false;
  public vocabularyAnsweredWrong: boolean = false;
  public showBlackCarret: boolean = false;

  public timeToAnswerVocabulary: number;
  public timeLeft: number;
  public maxTime: number;
  public progressBarWidth: number;

  public vocabularyToAnswer: any;
  public lastVocabulary: any[] = [];
  public lastAnswers: any[] = [];

  public answerGiven: boolean = false;


  public timerSub: Subscription;

  constructor(
    private commonService: CommonRequestService,
    private dataService: AnswerVocabularyService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['idLanguage'] && +params['idLanguage'] > 0){
        this.idSubjectFromQueryParams = +params['idLanguage'];
      }
      this.getSubjects();
    })
  }

  private getSubjects(){
    this.commonService.getVocabularySubjects().subscribe(subjects => {
      this.subjects = subjects;
      this.selectedSubject = this.idSubjectFromQueryParams != null ? this.subjects.find(f => f.idSubject == this.idSubjectFromQueryParams) : this.subjects[0];
    })
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
  }

  public startClick(){
    this.vocabularyToAnswer = null;
    this.lastAnswers = [];
    this.lastVocabulary = [];

    this.timeLeft = this.timeToAnswerVocabulary;
    this.maxTime = this.timeToAnswerVocabulary;

    if(this.timeLeft != null){
      this.progressBarWidth = 100;
            if(this.timerSub != null){
        this.timerSub.unsubscribe();
      }
      this.timerSub = interval(1000).subscribe(() => {
        if(this.timeLeft > 0 && !this.answerGiven){
          this.timeLeft--;
          this.progressBarWidth = this.timeLeft * 100 / this.maxTime;
          if(this.timeLeft == 0){
            this.checkAnswer();
          }
        }
      })
    }

    this.getVocabularyToAnswer(true);
  }

  public getVocabularyToAnswer(orderByLastTimeAnswered: boolean){
    if(this.vocabularyToAnswer != null){
      this.lastVocabulary.push(this.vocabularyToAnswer);
      this.lastAnswers.push(this.answer);
    }

    this.reset();

    this.noVocabularyFound = false;

    this.dataService.getVocabularyToAnswer(this.prioFrom, this.prioTo, this.selectedSubject.idSubject, orderByLastTimeAnswered).subscribe(vocabulary => {
      if(vocabulary.idVocabulary == 0){
        this.noVocabularyFound = true;
      }
      else{
        this.vocabularyToAnswer = vocabulary;
      }

      if(this.timeLeft != null){
        this.timeLeft = this.maxTime;
        this.progressBarWidth = 100;
      }
    })
  }

  public checkAnswer(){
    this.answerGiven = true;

    this.dataService.checkIfAnswerIsCorrect(this.vocabularyToAnswer.idVocabulary, this.answer).subscribe(correctAnswer => {
      if(correctAnswer){
        this.vocabularyAnsweredCorrectly = true;
        this.adjustPrioOfVocabulary(true);
      }
      else{
        this.vocabularyAnsweredWrong = true;
        this.adjustPrioOfVocabulary(false);
      }
    }, error => {
      console.error(error);
    })
  }

  private adjustPrioOfVocabulary(answeredCorrectly: boolean){
    this.dataService.adjustPrioOfVocabulary(this.vocabularyToAnswer.idVocabulary, answeredCorrectly).subscribe();
  }

  public getLastAnsweredVocabulary(){
    this.vocabularyToAnswer = this.lastVocabulary[this.lastVocabulary.length - 1];
    this.lastVocabulary.splice(this.lastVocabulary.length - 1, 1);

    this.answer = this.lastAnswers[this.lastAnswers.length - 1];
    this.lastAnswers.splice(this.lastAnswers.length - 1, 1);
  }

  private reset(){
    this.answer = '';
    this.answerGiven = false;
    this.vocabularyAnsweredCorrectly = false;
    this.vocabularyAnsweredWrong = false;
    this.noVocabularyFound = false;
    this.showBlackCarret = false;
  }

}

import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { ActivatedRoute } from "@angular/router";
import { Observable, of, interval, Subscriber, Subscription, forkJoin } from "rxjs";
import { delay, map, mergeMap, tap } from "rxjs/operators";
import { ISubject, ISubjectArea } from "../interfaces/interfaces";
import { ShowImageInFullScreenComponent } from "../shared/show-image-in-full-screen/show-image-in-full-screen.component";
import { AnswerQuestionService } from "./shared/answer-question.service";

@Component({
  selector: 'answer-question',
  templateUrl: './answer-question.component.html'
})

export class AnswerQuestionComponent implements OnInit{
  @ViewChild('showImageComponent') showImageComponent: ShowImageInFullScreenComponent;
  subjects: ISubject[] = [];
  selectedSubject: ISubject;

  private queryParamsIdSubject: number;

  selectedSubjectAreas: ISubjectArea[] = [];

  subjectAreas: ISubjectArea[] = [];

  prioFrom = 1;
  prioTo = 10;

  questionToAnswer: any;

  multipleChoiceGuessedAnswer: number;

  multipleChoiceQuestionAnsweredWrong = false;
  normalQuestionAnsweredWrong = false;
  answeredWithThoughtAnswer = false;
  multipleChoiceRightAnswer: string;

  questionAnsweredCorrectly = false;

  answerGiven = false;

  answer: string;

  showBlackCarret = false;

  percentageOfAnswerToLow = false;

  noQuestionsFound = false;

  lastQuestions: any[] = [];
  lastAnswers: string[] = [];

  timeToAnswerQuestion: number;
  timeLeft: number;
  maxTime: number;
  progressBarWidth: number;

  private timerSub: Subscription;

  questionImageSrc: string;
  questionLoading = false;
  showQuestionImageInFullScreen = false;
  fullScreenImagePath: string;
  onlyImageAnswers = false;

  started = false;

  constructor(
    private questionService: AnswerQuestionService,
    private route: ActivatedRoute,
    private fireStorage: AngularFireStorage
  ){}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryParamsIdSubject = 1; //Chemie Standard Fach
      if(params['idSubject'] && params['idSubject'] > 0){
        this.queryParamsIdSubject = +params['idSubject'];
      }
      this.getSubjects();
    })
  }

  private getSubjects(){
    this.questionService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
      this.selectedSubject = this.subjects.find(f => f.idSubject == this.queryParamsIdSubject);
      this.getSubjectAreas();
    })
  }

  public subjectChanged(subject: ISubject){
    this.selectedSubject = subject;
  }

  private getSubjectAreas(){
    this.questionService.getSubjectAreas(this.selectedSubject.idSubject).subscribe(areas => {
      this.subjectAreas = areas;
    })
  }
  public startClick(){
    this.started = true;
    this.questionToAnswer = null;
    this.lastQuestions = [];
    this.lastAnswers = [];

    this.timeLeft = this.timeToAnswerQuestion;
    this.maxTime = this.timeToAnswerQuestion;
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
    this.getQuestionToAnswer(true);
  }
  public getQuestionToAnswer(orderByLastTimeAnswered: boolean){
    if(this.questionToAnswer != null){
      this.lastQuestions.push(this.questionToAnswer);
      this.lastAnswers.push(this.answer);
    }
    this.reset();
    this.noQuestionsFound = false;
    this.questionLoading = true;
    this.questionService.getQuestionToAnswer(this.prioFrom, this.prioTo, this.selectedSubject.idSubject, this.selectedSubjectAreas.map(m => m.idSubjectArea), orderByLastTimeAnswered).pipe(mergeMap(question => {
      if (this.timeLeft != null) {
        this.timeLeft = this.maxTime;
        this.progressBarWidth = 100;
      }

      if(question.idQuestion == 0){
        this.noQuestionsFound = true;
        return of(question);
      }
      else{
        if(question.questionImage != null && question.questionImage != '' || question.answers.filter((f: any) => f.answerImage != '' && f.answerImage != null).length > 0){
          if(question.questionImage != null && question.questionImage != ''){
            return this.fireStorage.ref(question.questionImage).getDownloadURL().pipe(mergeMap(questionImage => {
              this.questionImageSrc = questionImage;
              if (question.answers.filter((f: any) => f.answerImage != '' && f.answerImage != null).length > 0){
                return this.downloadAnswerImages(question).pipe(map(() => {
                  return question;
                }));
              }
              else{
                return of(question);
              }
            }))
          }
          else{
            return this.downloadAnswerImages(question).pipe(map(() => {
              return question;
            }));
          }
        }
        else{
          return of(question);
        }
      }
    })).subscribe(question => {
      this.questionToAnswer = question;
      if (this.questionToAnswer.answers.filter((f: any) => f.answerImage == null || f.answerImage == '').length == 0){
        this.onlyImageAnswers = true;
      }
      this.questionLoading = false;
    }, error => {
      console.error(error);
      this.questionLoading = false;
    });
  }

  private downloadAnswerImages(question: any){
    let answerImageRequests: Observable<any>[] = [];
    question.answers.forEach((answer: any) => {
      if (answer.answerImage != null && answer.answerImage != '') {
        answerImageRequests.push(this.fireStorage.ref(answer.answerImage).getDownloadURL());
      }
    })
    return forkJoin(answerImageRequests).pipe(map(answerImages => {
      question.answers.forEach((answer: any) => {
        if (answer.answerImage != null && answer.answerImage != '') {
          answer.answerImage = answerImages[answerImages.length - 1];
          answerImages.pop();
        }
      })
    }))
  }

  public getLastAnsweredQuestion(){
    this.questionToAnswer = this.lastQuestions[this.lastQuestions.length - 1];
    this.lastQuestions.splice(this.lastQuestions.length - 1, 1);

    this.answer = this.lastAnswers[this.lastAnswers.length - 1];
    this.lastAnswers.splice(this.lastAnswers.length - 1, 1);
  }

  public multipleChoiceAnswerSelected(number: number){
    this.multipleChoiceGuessedAnswer = number;
  }

  public checkAnswer(){
    this.answerGiven = true;
    let questionAnsweredCorrectly: boolean = true;
    if(this.answer == '.'){
      this.answeredWithThoughtAnswer = true;
      return;
    }
    if(this.questionToAnswer.idQuestionType == 1 && this.answer != null && this.answer != ''){
      this.questionService.checkIfAnswerIsCorrect(this.questionToAnswer.idQuestion, this.answer).pipe(mergeMap(highestPercentag => {
        if(highestPercentag == 100){
          this.questionAnsweredCorrectly = true;
          this.adjustPrioOfQuestion(true).subscribe();
        }
        else if(highestPercentag == -1){
          this.normalQuestionAnsweredWrong = true;
          this.adjustPrioOfQuestion(false).subscribe();
        }
        else{
          this.percentageOfAnswerToLow = true;
        }
        return of(null);
      })).subscribe(() => {

      }, error => {
        console.error(error);
      })
    }
    else if (this.questionToAnswer.idQuestionType == 2){
      var numberRightAnswer = this.questionToAnswer.numberRightAnswer;
      if(this.multipleChoiceGuessedAnswer != numberRightAnswer){
        this.multipleChoiceRightAnswer = this.questionToAnswer.answers[numberRightAnswer - 1].answer;
        this.multipleChoiceQuestionAnsweredWrong = true;
        questionAnsweredCorrectly = false;
        this.adjustPrioOfQuestion(this.questionToAnswer.idQuestion).subscribe();
      }
      else{
        this.questionAnsweredCorrectly = true;
        questionAnsweredCorrectly = true;
      }

      this.adjustPrioOfQuestion(questionAnsweredCorrectly).subscribe();
    }
    else{
      if(this.questionToAnswer.idQuestionType == 1){
        this.normalQuestionAnsweredWrong = true;
      }
      else{
        this.multipleChoiceQuestionAnsweredWrong = true;
      }

      this.adjustPrioOfQuestion(false).subscribe();
    }
  }

  private adjustPrioOfQuestion(questionAnsweredCorrectly: boolean){
    return this.questionService.adjustPrioOfQuestion(this.questionToAnswer.idQuestion, questionAnsweredCorrectly).pipe(mergeMap(() => {
      return this.questionService.setLastTimeAnswered(this.questionToAnswer.idQuestion);
    }))
  }

  public addAnswerToRightAnswers(){
    this.questionService.addAnswerToRightAnswers(this.questionToAnswer.idQuestion, this.answer).subscribe(() => {
      this.adjustPrioOfQuestion(true).subscribe(() => {
        this.getQuestionToAnswer(true);
      });
    });
  }

  public addAnswerToWrongAnswers(){
    this.questionService.addAnswerToWrongAnswers(this.questionToAnswer.idQuestion, this.answer).subscribe(() => {
      this.adjustPrioOfQuestion(false).subscribe(() => {
        this.getQuestionToAnswer(true);
      });
    });
  }

  public progressThoughtAnswerResult(answeredCorrectly: boolean){
    this.answeredWithThoughtAnswer = false;
    this.adjustPrioOfQuestion(answeredCorrectly).subscribe(() => {
      this.getQuestionToAnswer(true);
    });
  }

  private reset(){
    this.answer = '';
    this.multipleChoiceGuessedAnswer = 0;
    this.multipleChoiceQuestionAnsweredWrong = false;
    this.questionAnsweredCorrectly = false;
    this.percentageOfAnswerToLow = false;
    this.normalQuestionAnsweredWrong = false;
    this.answerGiven = false;
    this.questionImageSrc = '';
    this.questionToAnswer = null;
    this.onlyImageAnswers = false;
  }

  public imageClicked(image: string){
    this.showImageComponent.showImageInFullScreen(image);
  }
}

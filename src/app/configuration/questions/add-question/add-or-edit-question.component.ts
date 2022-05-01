import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UUID } from "angular2-uuid";
import { jqxComboBoxComponent } from "jqwidgets-ng/jqxcombobox";
import { forkJoin, Observable, of } from "rxjs";
import { ignoreElements, map, mergeMap, tap } from "rxjs/operators";
import { CommonRequestService } from "src/app/shared/common-request.service";
import { ShowImageInFullScreenComponent } from "src/app/shared/show-image-in-full-screen/show-image-in-full-screen.component";
import { ConfigurationAddQuestionService } from "./shared/add-or-edit-question.service";


interface IAnswer{
  idAnswer: number,
  answer: string,
  answerImage: string,
  newAnswer: boolean
}
interface IAnswerImageFile{
  idAnswer: number,
  image: File
}
@Component({
  selector: 'configuration-add-question',
  templateUrl: './add-or-edit-question.component.html'
})

export class ConfigurationAddOrEditQuestionComponent implements OnInit{
  @ViewChild('subjectAreaComboBox') subjectAreaComboBox: jqxComboBoxComponent;
  @ViewChild('showImageComponent') showImageComponent: ShowImageInFullScreenComponent;

  public title: string = 'Frage hinzufügen';
  public subjects: any[];
  public selectedSubject: any;

  private subjectAreas: any[];
  public subjectAreaForDropdown: string[];
  public selectedSubjectArea: string;

  public selectedQuestionType: string = 'normal';

  public answers: IAnswer[] = [];

  public multipleChoiceRightAnswer: number = 0;

  public selectedPrio: number = 5;

  public question: string;

  private questionById: any;
  private idQuestion: number;

  public questionSaved: boolean = false;

  public notesWithPossibleQuestions: any[] = [];

  public openedNotes: number[] = [];

  public suggestedQuestionsExist: boolean;

  private questionImage: File;
  public questionImagePath: string;
  private questionImageUUID: string;

  public showImageInFullScreen: boolean = false;
  public fullScreenImagePath: string;

  private originalAnswersWithAnswerImageUUID: IAnswer[] = [];
  private answerImageFiles: IAnswerImageFile[] = [];

  public saveQuestionLoading: boolean = false;

  smallScreen = false;

  constructor(
    private questionService: ConfigurationAddQuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private commonRequestService: CommonRequestService,
    private fireStorage: AngularFireStorage
  ){}
  ngOnInit(): void {
    if (window.innerWidth < 900) {
      this.smallScreen = true;
    }

    this.route.queryParams.pipe(mergeMap(params => {
      if(params['idQuestion'] && params['idQuestion'] > 0){
        this.idQuestion = +params['idQuestion'];
        return this.questionService.getQuestionById(+params['idQuestion']).pipe(mergeMap((question: any) => {
          if (question.questionImage != null && question.questionImage != ''){
            this.questionImageUUID = question.questionImage;
            return this.fireStorage.ref(question.questionImage).getDownloadURL().pipe(mergeMap(questionImage => {
              this.questionImagePath = questionImage;
              return of(question);
            }))
          }
          else{
            return of(question);
          }
        }));
      }
      else{
        this.getData();
        return of(null);
      }
    })).subscribe(question => {
      if(question != null){
        this.title = 'Frage bearbeiten';
        this.questionById = question;
        this.selectedPrio = this.questionById.prio;
        this.question = this.questionById.question;
        this.setSelectedType(this.questionById.idQuestionType == 1 ? 'normal' : 'multipleChoice');
        if(this.questionById.idQuestionType == 2){
          this.multipleChoiceRightAnswer = this.questionById.numberRightAnswer;
        }
        this.suggestedQuestionsExist = false;

        this.getData();
      }
      else{
        this.fillAnswerArrayWithEmptyAnswers();
      }
    })
  }

  private downloadAnswerImages(question: any){
    let answerImageRequests: Observable<any>[] = [];
    this.originalAnswersWithAnswerImageUUID = [];
    question.answers.forEach((answer: any) => {
      if (answer.answerImage != null && answer.answerImage != '') {
        answerImageRequests.push(this.fireStorage.ref(answer.answerImage).getDownloadURL());
      }
    });

    if(answerImageRequests.length > 0){
      return forkJoin(answerImageRequests).pipe(map(answerImages => {
        answerImages.forEach(answerImage => {
          const answer = question.answers.filter((f: any) => f.answerImage != null && f.answerImage != '' && answerImage.includes(f.answerImage))[0];
          this.originalAnswersWithAnswerImageUUID.push({
            idAnswer: answer.idAnswer,
            answerImage: answer.answerImage,
            answer: '',
            newAnswer: false
          });
          answer.answerImage = answerImage;
        });
        return null;
      }))
    }
    return of(null);
  }

  private getData(){
    this.commonRequestService.getSubjects().pipe(mergeMap(subjects => {
      this.subjects = subjects;
      if(this.questionById == null){
        this.selectedSubject = this.subjects[0];
      }
      else{
        this.selectedSubject = this.subjects.find(s => s.idSubject == this.questionById.idSubject);
      }
      return this.commonRequestService.getSubjectAreas(this.selectedSubject.idSubject);
    })).subscribe(areas => {
      this.setSubjectAreas(areas);
    }, error => {
      console.error(error);
    })
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
    this.commonRequestService.getSubjectAreas(this.selectedSubject.idSubject).subscribe(areas => {
      this.setSubjectAreas(areas);
    });
  }

  private setSubjectAreas(areas: any[]){
      this.subjectAreas = areas;
      this.subjectAreaForDropdown = [];
      this.selectedSubjectArea = '';
      for(var i = 0; i < this.subjectAreas.length; i++){
        this.subjectAreaForDropdown.push(this.subjectAreas[i].descriptionSubjectArea);
      }

      if(this.questionById != null){
        this.selectedSubjectArea = areas.find(f => f.idSubjectArea == this.questionById.idSubjectArea).descriptionSubjectArea;
      }
      else{
        this.getSuggestedQuestions();
      }
  }

  public subjectAreaValueChange(subjectArea: any){
    this.selectedSubjectArea = this.subjectAreaComboBox.getSelectedItem().value;
    if(this.questionById == null){
      this.getSuggestedQuestions();
    }
  }

  public setSelectedType(questionType: string){
    this.selectedQuestionType = questionType;
    var idQuestionType = this.selectedQuestionType == 'normal' ? 1 : 2;
    this.answers = [];
    if(this.questionById != null && idQuestionType == this.questionById.idQuestionType){
      this.questionService.getAnswers(this.idQuestion).pipe(mergeMap(answers => {
        if(answers.length == 0){
          this.fillAnswerArrayWithEmptyAnswers();
          return of(null);
        }
        else{
          return this.downloadAnswerImages(this.questionById).pipe(tap(() => {
            answers.forEach(answer => {
              this.answers.push({
                idAnswer: answer.idAnswer,
                answer: answer.answer,
                answerImage: this.questionById.answers.filter((f: any) => f.idAnswer == answer.idAnswer)[0].answerImage,
                newAnswer: false
              });
            })
          }))
        }
      })).subscribe();
    }
    else{
      this.fillAnswerArrayWithEmptyAnswers();
    }
  }

  private fillAnswerArrayWithEmptyAnswers(){
    if(this.selectedQuestionType == 'multipleChoice'){
      for(var i = 0; i < 4; i++){
        this.answers.push({
          idAnswer: i+1,
          answer: '',
          answerImage: '',
          newAnswer: true
        });
      }
    }
    else{
      this.answers.push({
        idAnswer: 0,
        answer: '',
        answerImage: '',
        newAnswer: true
      });
    }
  }

  public addAnswer(){
    const nextAnswerId = this.getNextAnswerId();
    this.answers.push({idAnswer: nextAnswerId, answer: '', answerImage: '', newAnswer: true});
  }
  public addAnswerImage(answerImagePath: string){
    const nextAnswerId = this.getNextAnswerId();
    this.answers.push({idAnswer: nextAnswerId, answer: '', answerImage: answerImagePath, newAnswer: true})
  }
  private getNextAnswerId(){
    if(this.answers.length > 0){
      return this.answers[this.answers.length - 1].idAnswer + 1;
    }
    return 1;
  }

  public removeAnswer(answer: IAnswer){
    let index = this.answers.findIndex(f => f.idAnswer == answer.idAnswer);

    if(index > -1){
      this.answers.splice(index, 1);
    }

    if(!answer.newAnswer){
      this.questionService.deleteAnswer(answer.idAnswer).subscribe();
    }
  }
  public removeAnswerImage(answer: IAnswer){
    if(answer.newAnswer){
      this.removeAnswer(answer);
    }
    else{
      this.fireStorage.ref(this.originalAnswersWithAnswerImageUUID.filter(f => f.idAnswer == answer.idAnswer)[0].answerImage).delete().subscribe(() => {
        this.removeAnswer(answer);
      });
    }
  }

  public mulipleChoiceRightAnswerSelected(answer: number){
    this.multipleChoiceRightAnswer = answer
  }

  public prioRangeChanged(selectedPrio: any){
    this.selectedPrio = selectedPrio;
  }

  public async saveQuestion(){
    this.saveQuestionLoading = true;
    if(this.questionImage != null){
      this.questionImageUUID = UUID.UUID();
      await this.fireStorage.upload(`/${this.questionImageUUID}`, this.questionImage)
    }
    if(this.answers.filter(f => f.answerImage != null && f.answerImage != '').length > 0){
      let uuid;
      for(var i = 0; i < this.answers.length; i++){
        if (this.answers[i].answerImage != null && this.answers[i].answerImage != ''){
          if(this.answers[i].newAnswer){
            uuid = UUID.UUID();
            await this.fireStorage.upload(`/${uuid}`, this.answerImageFiles.filter(f => f.idAnswer == this.answers[i].idAnswer)[0].image);
            this.answers[i].answerImage = uuid;
          }
          else if (!this.answers[i].newAnswer){
            this.answers[i].answerImage = this.originalAnswersWithAnswerImageUUID.filter(f => f.idAnswer == this.answers[i].idAnswer)[0].answerImage;
          }
        }
      }
    }

    if (this.questionById == null) {
      this.addNewQuestion();
    }
    else {
      this.updateQuestion();
    }
  }

  private addNewQuestion(){
    var idSubjectArea = this.subjectAreas.find(f => f.descriptionSubjectArea == this.selectedSubjectArea && f.idSubject == this.selectedSubject.idSubject).idSubjectArea;
    var idQuestionType = this.selectedQuestionType == 'normal' ? 1 : 2;
    let questionAnswers: any[] = [];
    this.answers.forEach(answer => {
      if(answer.answer != null && answer.answer != ''){
        questionAnswers.push({
          idAnswer: null,
          answer: answer.answer,
          answerImage: null
        });
      }
      else if(answer.answerImage != null && answer.answerImage != ''){
        questionAnswers.push({
          idAnswer: null,
          answer: null,
          answerImage: answer.answerImage
        });
      }
    })
    return this.questionService.saveQuestion(
      this.selectedSubject.idSubject,
      idSubjectArea,
      this.selectedPrio,
      this.question,
      this.questionImageUUID,
      idQuestionType,
      questionAnswers,
      this.multipleChoiceRightAnswer).subscribe(() => {
        this.questionSaved = true;
        this.saveQuestionLoading = false;
        setTimeout(() => {
          this.questionSaved = false;
        }, 2500);
        this.reset();
      }, error => {
        this.saveQuestionLoading = false;
        console.error(error);
      });
  }

  private updateQuestion(){
    var idSubjectArea = this.subjectAreas.find(f => f.descriptionSubjectArea == this.selectedSubjectArea && f.idSubject == this.selectedSubject.idSubject).idSubjectArea;
    var idQuestionType = this.selectedQuestionType == 'normal' ? 1 : 2;
    let oldAnswers = this.answers.filter(f => !f.newAnswer).map(m => {
      var newObj: any = {idAnswer: 0, answer: ''};
      newObj['idAnswer']=m.idAnswer;
      newObj['answer']=m.answer;
      newObj['answerImage']=m.answerImage;
      return newObj;
    });
    let newAnswers = this.answers.filter(f => f.newAnswer).map(m => {
      var newObj: any = { idAnswer: 0, answer: '' };
      newObj['idAnswer'] = m.idAnswer;
      newObj['answer'] = m.answer;
      newObj['answerImage'] = m.answerImage;
      return newObj;
    });
    this.questionService.updateQuestion(
      this.idQuestion,
      this.selectedSubject.idSubject,
      idSubjectArea,
      this.selectedPrio,
      this.question,
      this.questionImageUUID,
      idQuestionType,
      this.multipleChoiceRightAnswer,
      newAnswers,
      oldAnswers).pipe(mergeMap(() => {
        if(idQuestionType != this.questionById.idQuestionType){
          return this.questionService.deleteAllAnswersFromQuestion(this.idQuestion).pipe(mergeMap(() => {
            let answers: string[] = this.answers.map(m => m.answer);
            return this.questionService.addNewAnswersToQuestion(this.idQuestion, answers);
          }))
        }
        return of(null);
      })).subscribe(() => {
        this.saveQuestionLoading = false;
        this.reset();
      }, error => {
        this.saveQuestionLoading = false;
        console.error(error);
      });
  }

  private reset(){
    if(this.questionById == null){
      this.selectedPrio = 5;
      this.multipleChoiceRightAnswer = 0;
      this.question = '';
      this.questionImagePath = '';
      this.questionImageUUID = '';
      this.originalAnswersWithAnswerImageUUID = [];
      this.answerImageFiles = [];
      this.setSelectedType(this.selectedQuestionType);
    }
    else{
      this.router.navigate(['configuration','manageQuestions']);
    }

  }

  private getSuggestedQuestions(){
    var subjectArea = this.subjectAreas.find(f => f.descriptionSubjectArea == this.selectedSubjectArea && f.idSubject == this.selectedSubject.idSubject);

    this.questionService.getSuggestedQuestions(this.selectedSubject.idSubject, subjectArea == null ? 0 : subjectArea.idSubjectArea).subscribe(suggestedQuestions => {
      this.notesWithPossibleQuestions = suggestedQuestions;
      if(this.notesWithPossibleQuestions.length > 0){
        this.suggestedQuestionsExist = true;
      }else{
        this.suggestedQuestionsExist = false;
      }
    })
  }

  public expandNote(idNote: number){
    let index = this.openedNotes.findIndex(f => f == idNote);
    if(index == -1){
      this.openedNotes.push(idNote);
    }
    else{
      this.openedNotes.splice(index, 1);
    }
  }

  public isNoteOpened(idNote: number){
    return this.openedNotes.find(f => f == idNote) != null;
  }

  public takeSuggestedQuestion(question: any, note: any){
    this.question = question.question;
    let subjectArea = this.subjectAreas.find(f => f.idSubjectArea == note.idSubjectArea).descriptionSubjectArea;
    let index = this.subjectAreaForDropdown.findIndex(f => f == subjectArea);
    if(index != -1){
      this.selectedSubjectArea = this.subjectAreaForDropdown[index];
    }
  }

  public onQuestionImageChange(event: any){
    this.questionImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.questionImagePath = e.target.result;
    }
    reader.readAsDataURL(this.questionImage);
  }
  public onAnswerImageChange(event: any){
    const reader = new FileReader();
    reader.onload = (e:any) => {
      this.addAnswerImage(e.target.result);
    }
    reader.readAsDataURL(event.target.files[0]);
    this.answerImageFiles.push({
      idAnswer: this.getNextAnswerId(),
      image: event.target.files[0]
    });
  }
  public onImageClick(imagePath: string){
    this.showImageComponent.showImageInFullScreen(imagePath);
  }
}

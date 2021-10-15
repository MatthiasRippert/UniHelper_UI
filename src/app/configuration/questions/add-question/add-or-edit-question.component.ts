import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { jqxComboBoxComponent } from "jqwidgets-ng/jqxcombobox";
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { ConfigurationAddQuestionService } from "./shared/add-or-edit-question.service";


interface IAnswer{
  idAnswer: number,
  answer: string
}
@Component({
  selector: 'configuration-add-question',
  templateUrl: './add-or-edit-question.component.html'
})

export class ConfigurationAddOrEditQuestionComponent implements OnInit{

  @ViewChild('subjectAreaComboBox') subjectAreaComboBox: jqxComboBoxComponent;

  public subjects: any[];
  public selectedSubject: any;

  private subjectAreas: any[];
  public subjectAreaForDropdown: string[];
  public selectedSubjectArea: string;

  public selectedQuestionType: string = 'normal';

  public answers: IAnswer[] = [{idAnswer: 1, answer: ''}];

  public multipleChoiceRightAnswer: number = 0;

  public selectedPrio: number = 5;

  public question: string;

  private questionById: any[];
  private idQuestion: number;
  constructor(
    private questionService: ConfigurationAddQuestionService,
    private route: ActivatedRoute
  ){}
  ngOnInit(): void {
    this.route.queryParams.pipe(mergeMap(params => {
      if(params['idQuestion'] && params['idQuestion'] > 0){
        this.idQuestion = +params['idQuestion'];
        return this.questionService.getQuestionById(+params['idQuestion']);
      }
      else{
        this.getData();
        return of(null);
      }
    })).subscribe(question => {
      if(question != null){
        this.questionById = question;
        this.selectedPrio = this.questionById[0].prio;
        this.question = this.questionById[0].question;
        this.setSelectedType(this.questionById[0].idQuestionType == 1 ? 'normal' : 'multipleChoice');
        if(this.questionById[0].idQuestionType == 2){
          this.multipleChoiceRightAnswer = this.questionById[0].numberRightAnswer;
          console.log("Right Answer: ", this.multipleChoiceRightAnswer);
        }
        this.answers = [];
        for(var i = 0; i < this.questionById.length; i++){
          this.answers.push({
            idAnswer: i+1,
            answer: this.questionById[i].answer
          });
        }
        this.getData();
      }
    })
  }

  private getData(){
    this.questionService.getSubjects().pipe(mergeMap(subjects => {
      this.subjects = subjects;
      if(this.questionById == null){
        this.selectedSubject = this.subjects[0];
      }
      else{
        this.selectedSubject = this.subjects.find(s => s.idSubject == this.questionById[0].idSubject);
      }
      return this.questionService.getSubjectAreas(this.selectedSubject.idSubject);
    })).subscribe(areas => {
      this.setSubjectAreas(areas);
    }, error => {
      console.error(error);
    })
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
    this.questionService.getSubjectAreas(this.selectedSubject.idSubject).subscribe(areas => {
      this.setSubjectAreas(areas);
    });
  }

  private setSubjectAreas(areas: any[]){
      this.subjectAreas = areas;
      this.subjectAreaForDropdown = [];
      for(var i = 0; i < this.subjectAreas.length; i++){
        this.subjectAreaForDropdown.push(this.subjectAreas[i].description);
      }
      if(this.questionById != null){
        this.selectedSubjectArea = areas.find(f => f.idSubjectArea == this.questionById[0].idSubjectArea).description;
      }
  }

  public subjectAreaValueChange(subjectArea: any){
    this.selectedSubjectArea = this.subjectAreaComboBox.getSelectedItem().value;
  }

  public setSelectedType(questionType: string){
    this.selectedQuestionType = questionType;
    this.answers = []
    if(this.selectedQuestionType == 'multipleChoice'){
      for(var i = 0; i < 4; i++){
        this.answers.push({
          idAnswer: i+1,
          answer: ''
        });
      }
    }
    else{
      this.answers.push({
        idAnswer: 1,
        answer: ''
      });
    }
  }

  public addAnswer(){
    var nextAnswerId = this.answers[this.answers.length - 1].idAnswer;
    this.answers.push({idAnswer: nextAnswerId, answer: ''});
  }

  public removeAnswer(answer: IAnswer){
    let index = this.answers.findIndex(f => f.idAnswer == answer.idAnswer);
    if(index > -1){
      this.answers.splice(index, 1);
    }
  }

  public mulipleChoiceRightAnswerSelected(answer: number){
    this.multipleChoiceRightAnswer = answer
  }

  public prioRangeChanged(selectedPrio: any){
    this.selectedPrio = selectedPrio;
  }

  public saveQuestion(){
    if(this.questionById == null){
      this.addNewQuestion();
    }
    else{
      this.updateQuestion();
    }
  }

  private addNewQuestion(){
    var idSubjectArea = this.subjectAreas.find(f => f.description == this.selectedSubjectArea && f.idSubject == this.selectedSubject.idSubject).idSubjectArea;
    var idQuestionType = this.selectedQuestionType == 'normal' ? 1 : 2;
    return this.questionService.saveQuestion(
      this.selectedSubject.idSubject,
      idSubjectArea,
      this.selectedPrio,
      this.question,
      idQuestionType,
      this.answers.map(m => m.answer),
      this.multipleChoiceRightAnswer).subscribe(() => {
        this.reset();
      }, error => {
        console.error(error);
      });
  }

  private updateQuestion(){
    this.questionService.deleteQuestion(this.idQuestion).subscribe(() => {
      this.addNewQuestion();
    })
  }

  private reset(){
    this.selectedPrio = 5;
    this.multipleChoiceRightAnswer = 0;
    this.setSelectedType(this.selectedQuestionType);
  }

}

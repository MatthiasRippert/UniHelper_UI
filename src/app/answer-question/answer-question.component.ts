import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { jqxComboBoxComponent } from "jqwidgets-ng/jqxcombobox";
import { AnswerQuestionService } from "./shared/answer-question.service";

@Component({
  selector: 'answer-question',
  templateUrl: './answer-question.component.html'
})

export class AnswerQuestionController implements OnInit{
  @ViewChild('subjectAreaComboBox') subjectAreaComboBox: jqxComboBoxComponent;
  public subjects: any[] = [];
  public selectedSubject: any;

  private queryParamsIdSubject: number;

  public selectedSubjectArea: string;

  public subjectAreas: any[] = [];
  public subjectAreaForDropdown: string[] = [];

  public prioFrom: number = 1;
  public prioTo: number = 10;

  public questionToAnswer: any[];
  constructor(
    private questionService: AnswerQuestionService,
    private route: ActivatedRoute
  ){}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['idSubject'] && params['idSubject'] > 0){
        this.queryParamsIdSubject = +params['idSubject'];
        this.getSubjects();
      }
    })
  }

  private getSubjects(){
    this.questionService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
      this.selectedSubject = this.subjects.find(f => f.idSubject == this.queryParamsIdSubject);
      this.getSubjectAreas();
    })
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
  }

  public subjectAreaValueChange(){
    this.selectedSubjectArea = this.subjectAreaComboBox.getSelectedItem().value;
  }

  private getSubjectAreas(){
    this.questionService.getSubjectAreas(this.selectedSubject.idSubject).subscribe(areas => {
      this.subjectAreas = areas;
      this.subjectAreaForDropdown = [];
      this.subjectAreaForDropdown.push('Alle Themenbereiche');
      this.subjectAreas.forEach(area => {
        this.subjectAreaForDropdown.push(area.description);
      })
    })
  }
  public getQuestionToAnswer(){
    let idSubjectArea = this.subjectAreas.find(f => f.description == this.selectedSubjectArea);
    this.questionService.getQuestionToAnswer(this.prioFrom, this.prioTo, this.selectedSubject.idSubject, idSubjectArea == null ? 0 : idSubjectArea).subscribe(question => {
      this.questionToAnswer = question;
      console.log(this.questionToAnswer);
    })
  }

  public getLastAnsweredQuestion(){

  }
}

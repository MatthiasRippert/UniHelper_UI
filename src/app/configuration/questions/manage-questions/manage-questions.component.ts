import { query } from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { jqxComboBoxComponent } from "jqwidgets-ng/jqxcombobox";
import { ManageQuestionsService } from "./shared/manage-questions.service";

@Component({
  selector: 'configuration-manage-questions',
  templateUrl: './manage-questions.component.html'
})

export class ConfigurationManageQuestionsComponent implements OnInit{
  @ViewChild('subjectAreaComboBox') subjectAreaComboBox: jqxComboBoxComponent;
  public selectedSubject: any;
  public subjects: any[] = [];
  public questions: any[] = [];

  public questionSearchText: string = '';

  private subjectAreas: any[];
  public subjectAreaForDropdown: string[];
  private selectedSubjectArea: string;

  public showDeleteQuestionAlert: boolean;
  public questionToDelete: any;
  constructor(
    private questionService: ManageQuestionsService,
    private router: Router
  ){}
  ngOnInit(): void {
    this.getSubjects();
  }

  private getSubjects(){
    this.questionService.getSubjects().subscribe(res => {
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
    this.questionService.getSubjectAreas(this.selectedSubject.idSubject).subscribe(areas => {
      this.subjectAreas = areas;
      this.subjectAreaForDropdown = [];
      this.subjectAreaForDropdown.push('Alle Themenbereiche')
      this.subjectAreas.forEach(area => {
        this.subjectAreaForDropdown.push(area.description);
      })
      if(this.questionSearchText != ''){
        this.getQuestionBySearchText();
      }
      else{
        this.getQuestions()
      }
    })
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
    this.getSubjectAreas();
  }
  private getQuestions(){
    var idSubjectArea = this.getSelectedSubjectAreaId();
    this.questionService.getQuestions(this.selectedSubject.idSubject, idSubjectArea).subscribe(questions => {
      this.fillQuestions(questions);
    })
  }

  public getQuestionBySearchText(){
    var idSubjectArea = this.getSelectedSubjectAreaId();
    this.questionService.getQuestionsByText(this.selectedSubject.idSubject, this.questionSearchText, idSubjectArea).subscribe(questions => {
      this.fillQuestions(questions);
    })
  }

  private getSelectedSubjectAreaId(){
    let idSubjectArea: number = 0;
    if(this.selectedSubjectArea != 'Alle Themenbereiche'){
      if(this.selectedSubjectArea != null && this.selectedSubject.idSubject != 0){
        idSubjectArea = this.subjectAreas.find(f => f.idSubject == this.selectedSubject.idSubject && f.description == this.selectedSubjectArea).idSubjectArea;
      }
      else if(this.selectedSubjectArea != null){
        idSubjectArea = this.subjectAreas.find(f => f.description == this.selectedSubjectArea).idSubjectArea;
      }
    }
    return idSubjectArea;
  }

  private fillQuestions(questions: any[]){
    this.questions = [];
      questions.forEach(q => {
        this.questions.push({
          idQuestion: q.idQuestion,
          question: q.question,
          subject: this.subjects.find(f => f.idSubject == q.idSubject).description,
          subjectArea: this.subjectAreas.find(f => f.idSubjectArea == q.idSubjectArea).description,
          createdAt: q.createdAt
        })
      });
  }
  public subjectAreaValueChange(subjectArea: any){
    this.selectedSubjectArea = this.subjectAreaComboBox.getSelectedItem().value;
    if(this.questionSearchText == null || this.questionSearchText == ''){
      this.getQuestions();
    }else{
      this.getQuestionBySearchText();
    }
  }
  public questionClicked(question: any){
    console.log(question);
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
    console.log(this.questionToDelete);
    this.questionService.deleteQuestion(this.questionToDelete.idQuestion).subscribe(() => {
      if(this.questionSearchText != null && this.questionSearchText != ''){
        this.getQuestionBySearchText();
      }
      else{
        this.getQuestions();
      }
      this.closeDeleteQuestionAlert();
    })
  }

  public closeDeleteQuestionAlert(){
    this.showDeleteQuestionAlert = false;
  }

}

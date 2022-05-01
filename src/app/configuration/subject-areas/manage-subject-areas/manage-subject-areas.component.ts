import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonRequestService } from "src/app/shared/common-request.service";
import { ManageSubjectAreasService } from "./shared/manage-subject-areas.service";

@Component({
  selector: 'manage-subject-areas',
  templateUrl: './manage-subject-areas.component.html'
})

export class ManageSubjectAreasComponent implements OnInit{
  public subjectAreaSearchText: string;

  public subjects: any[] = [];
  public selectedSubject: any;

  public subjectAreas: any[] = [];

  public areaToDelete: any;

  public showDeleteAreaAlert: boolean = false;
  public showDeleteSuccessAlert: boolean = false;
  public showDeleteErrorAlert: boolean = false;

  smallScreen = false;

  constructor(
    private commonRequestService: CommonRequestService,
    private manageSubjectAreasService: ManageSubjectAreasService,
    private router: Router
  ){}
  ngOnInit(): void {
    if(window.innerWidth < 900){
      this.smallScreen = true;
    }
    this.getSubjects();
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
  public getSubjectAreas(){
    this.manageSubjectAreasService.getSubjectAreasWithSubject(this.selectedSubject.idSubject).subscribe(areas => {
      this.subjectAreas = areas;
    });
  }
  public getSubjectAreaBySearchText(){
    this.manageSubjectAreasService.getSubjectAreaBySearchText(this.selectedSubject.idSubject, this.subjectAreaSearchText).subscribe(areas => {
      this.subjectAreas = areas;
    })
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
    this.manageSubjectAreasService.getSubjectAreasWithSubject(this.selectedSubject.idSubject).subscribe(areas => {
      this.subjectAreas = areas;
    })
  }

  public addSubjectArea(){
    this.router.navigate(['configuration/manageSubjectAreas/createOrEditSubjectArea']);
  }

  public areaClicked(area: any){
    var queryParams = {
      idSubjectArea: area.idSubjectArea
    };

    this.router.navigate(['configuration/manageSubjectAreas/createOrEditSubjectArea'], {queryParams: queryParams});
  }

  public showDeleteSubjectAreaAlert(alert: any){
    this.areaToDelete = alert;
    this.showDeleteAreaAlert = true;
  }

  public deleteQuestion(){
    this.closeDeleteQuestionAlert();
    this.manageSubjectAreasService.deleteSubjectArea(this.areaToDelete.idSubjectArea).subscribe(success => {
      if(success){
        this.showDeleteSuccessAlert = true;
        setTimeout(() => {
          this.showDeleteSuccessAlert = false;
        }, 2500);
      }
      else{
        this.showDeleteErrorAlert = true;
        setTimeout(() => {
          this.showDeleteErrorAlert = false;
        }, 2500);
      }
    })
  }

  public closeDeleteQuestionAlert(){
    this.showDeleteAreaAlert = false;
  }
}

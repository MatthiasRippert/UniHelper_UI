import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { CommonRequestService } from "src/app/shared/common-request.service";
import { AddOrEditSubjectAreaService } from "./shared/add-or-edit-subject-area.service";

@Component({
  selector: 'add-or-edit-subject-area',
  templateUrl: './add-or-edit-subject-area.component.html'
})

export class AddOrEditSubjectAreaComponent implements OnInit{
  public title: string = 'Themenbereich hinzufügen';

  public selectedSubject: any;
  public subjects: any[] = [];

  public subjectArea: string;

  public subjectAreaExists: boolean = false;
  public subjectAreaSaved: boolean = false;

  private idSubjectAreaFromQueryParams: number;
  private subjectAreaToEdit: any;

  smallScreen = false;

  constructor(
    private commonRequestService: CommonRequestService,
    private subjectAreaService: AddOrEditSubjectAreaService,
    private route: ActivatedRoute,
    private router: Router
  ){}
  ngOnInit(): void {
    if(window.innerWidth < 900){
      this.smallScreen = true;
    }
    this.route.queryParams.pipe(mergeMap(params => {
      if(params['idSubjectArea'] && params['idSubjectArea'] > 0){
        this.idSubjectAreaFromQueryParams = +params['idSubjectArea'];
        return this.subjectAreaService.getSubjectAreaById(this.idSubjectAreaFromQueryParams);
      }
      return of(null);
    })).subscribe(res => {
      this.getSubjects();
      if(res != null){
        this.subjectAreaToEdit = res;
        this.subjectArea = this.subjectAreaToEdit.descriptionSubjectArea;
      }
    })
  }

  private getSubjects(){
    this.commonRequestService.getSubjects().subscribe(res => {
      res.forEach(r => {
        this.subjects.push({
          idSubject: r.idSubject,
          description: r.description,
          vocabulary: r.vocabulary
        });
      });
      if(this.idSubjectAreaFromQueryParams == null){
        this.selectedSubject = this.subjects[0];
      }
      else{
        this.selectedSubject = this.subjects.find(f => f.idSubject == this.subjectAreaToEdit.idSubject);
      }
    })
  }
  public saveSubjectArea(){
    if(this.subjectAreaToEdit == null){
      this.subjectAreaService.addSubjectArea(this.selectedSubject.idSubject, this.subjectArea).subscribe(subjectAreaExists => {
        if(subjectAreaExists){
          this.subjectAreaExists = true;
          setTimeout(() => {
            this.subjectAreaExists = false;
          }, 2500);
        }
        else{
          this.subjectAreaSaved = true;
          setTimeout(() => {
            this.subjectAreaSaved = false;
          }, 2500);
        }
      })
    }
    else{
      this.subjectAreaService.updateSubjectArea(this.idSubjectAreaFromQueryParams, this.selectedSubject.idSubject, this.subjectArea).subscribe(() => {
        this.router.navigate(['configuration/manageSubjectAreas']);
      })
    }
  }

  public subjectChanged(subject: any){
    this.selectedSubject = subject;
  }

  private reset(){
    this.subjectAreaExists = false;
  }

}

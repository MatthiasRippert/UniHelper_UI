import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth-guard.service";
import { AnswerQuestionComponent } from "./answer-question.component";

const routes: Routes = [
 {
   path: 'answerQuestion',
   data: {
     title: 'Fragen beantworten'
   },
    component: AnswerQuestionComponent,
    canActivate: [AuthGuard]
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AnswerQuestionRoutingModule { }

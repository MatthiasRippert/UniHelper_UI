import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AnswerQuestionController } from "./answer-question.component";

const routes: Routes = [
 {
   path: 'answerQuestion',
   data: {
     title: 'Fragen beantworten'
   },
   component: AnswerQuestionController
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AnswerQuestionRoutingModule { }

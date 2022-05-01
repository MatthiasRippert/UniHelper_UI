import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth-guard.service";
import { AnswerVocabularyComponent } from "./answer-vocabulary.component";

const routes: Routes = [
 {
   path: 'vocabulary',
   data: {
     title: 'Vokabeln beantworten'
   },
    component: AnswerVocabularyComponent,
    canActivate: [AuthGuard]
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AnswerVocabularyRoutingModule { }

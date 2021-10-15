import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConfigurationAddOrEditQuestionComponent } from "./questions/add-question/add-or-edit-question.component";
import { ConfigurationManageQuestionsComponent } from "./questions/manage-questions/manage-questions.component";

const routes: Routes = [
 {
   path: 'configuration/manageQuestions',
   data: {
     title: 'Fragen verwalten'
   },
   component: ConfigurationManageQuestionsComponent
 },
 {
   path: 'configuration/manageQuestions/createOrEditQuestion',
   data: {
     title: 'Frage hinzufügen'
   },
   component: ConfigurationAddOrEditQuestionComponent
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class ConfigurationRoutingModule { }

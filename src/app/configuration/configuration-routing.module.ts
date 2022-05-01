import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth-guard.service";
import { ConfigurationAddOrEditQuestionComponent } from "./questions/add-question/add-or-edit-question.component";
import { ConfigurationManageQuestionsComponent } from "./questions/manage-questions/manage-questions.component";
import { AddOrEditSubjectAreaComponent } from "./subject-areas/add-or-edit-subject-area/add-or-edit-subject-area.component";
import { ManageSubjectAreasComponent } from "./subject-areas/manage-subject-areas/manage-subject-areas.component";
import { AddOrEditVocabularyComponent } from "./vocabulary/add-or-edit-vocabulary/add-or-edit-vocabulary.component";
import { ManageVocabularyComponent } from "./vocabulary/manage-vocabulary/manage-vocabulary.component";

const routes: Routes = [
 {
   path: 'configuration/manageQuestions',
   data: {
     title: 'Fragen verwalten'
   },
    component: ConfigurationManageQuestionsComponent,
    canActivate: [AuthGuard]
 },
 {
   path: 'configuration/manageQuestions/createOrEditQuestion',
   data: {
     title: 'Frage hinzufügen oder bearbeiten'
   },
   component: ConfigurationAddOrEditQuestionComponent,
   canActivate: [AuthGuard]
 },
 {
   path: 'configuration/manageSubjectAreas',
   data: {
     title: 'Themenbereiche verwalten'
   },
   component: ManageSubjectAreasComponent,
   canActivate: [AuthGuard]
 },
 {
   path: 'configuration/manageSubjectAreas/createOrEditSubjectArea',
   data: {
     title: 'Themenbereich hinzufügen oder bearbeiten'
   },
   component: AddOrEditSubjectAreaComponent,
   canActivate: [AuthGuard]
 },
 {
   path: 'configuration/manageVocabulary',
   data: {
     title: 'Vokabeln verabreiten'
   },
   component: ManageVocabularyComponent,
   canActivate: [AuthGuard]
 },
 {
   path: 'configuration/manageVocabulary/addOrEditVocabulary',
   data: {
     title: 'Vokabel hinzufügen oder bearbeiten'
   },
   component: AddOrEditVocabularyComponent,
   canActivate: [AuthGuard]
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class ConfigurationRoutingModule { }

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { jqxComboBoxModule } from 'jqwidgets-ng/jqxcombobox';
import { AnswerVocabularyModule } from "../answer-vocabulary/answer-vocabulary.module";
import { CommonRequestService } from "../shared/common-request.service";
import { ConfigurationRoutingModule } from "./configuration-routing.module";
import { ConfigurationAddOrEditQuestionComponent } from "./questions/add-question/add-or-edit-question.component";
import { ConfigurationAddQuestionService } from "./questions/add-question/shared/add-or-edit-question.service";
import { ConfigurationManageQuestionsComponent } from "./questions/manage-questions/manage-questions.component";
import { ManageQuestionsService } from "./questions/manage-questions/shared/manage-questions.service";
import { AddOrEditSubjectAreaComponent } from "./subject-areas/add-or-edit-subject-area/add-or-edit-subject-area.component";
import { AddOrEditSubjectAreaService } from "./subject-areas/add-or-edit-subject-area/shared/add-or-edit-subject-area.service";
import { ManageSubjectAreasComponent } from "./subject-areas/manage-subject-areas/manage-subject-areas.component";
import { ManageSubjectAreasService } from "./subject-areas/manage-subject-areas/shared/manage-subject-areas.service";
import { AddOrEditVocabularyComponent } from "./vocabulary/add-or-edit-vocabulary/add-or-edit-vocabulary.component";
import { AddOrEditVocabularyService } from "./vocabulary/add-or-edit-vocabulary/shared/add-or-edit-vocabulary.service";
import { ManageVocabularyComponent } from "./vocabulary/manage-vocabulary/manage-vocabulary.component";
import { ManageVocabularyService } from "./vocabulary/manage-vocabulary/shared/manage-vocabulary.service";
import { AngularFireStorageModule } from "@angular/fire/compat/storage"
import { AngularFireModule } from "@angular/fire/compat"
import { AuthGuard } from "../guards/auth-guard.service";
import { SharedModule } from "../shared/shared.module";
@NgModule({
  imports: [
    ConfigurationRoutingModule,
    CommonModule,
    jqxComboBoxModule,
    FormsModule,
    RouterModule,
    AnswerVocabularyModule,
    AngularFireStorageModule,
    SharedModule
  ],
  declarations: [
    ConfigurationManageQuestionsComponent,
    ConfigurationAddOrEditQuestionComponent,
    ManageSubjectAreasComponent,
    AddOrEditSubjectAreaComponent,
    ManageVocabularyComponent,
    AddOrEditVocabularyComponent
  ],
  providers: [
    ConfigurationAddQuestionService,
    ManageQuestionsService,
    CommonRequestService,
    AddOrEditSubjectAreaService,
    ManageSubjectAreasService,
    ManageVocabularyService,
    AddOrEditVocabularyService,
    AuthGuard
  ]
})

export class ConfigurationModule { }

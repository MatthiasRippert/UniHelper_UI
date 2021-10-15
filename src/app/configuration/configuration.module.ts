import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { jqxComboBoxModule }   from 'jqwidgets-ng/jqxcombobox';
import { ConfigurationRoutingModule } from "./configuration-routing.module";
import { ConfigurationAddOrEditQuestionComponent } from "./questions/add-question/add-or-edit-question.component";
import { ConfigurationAddQuestionService } from "./questions/add-question/shared/add-or-edit-question.service";
import { ConfigurationManageQuestionsComponent } from "./questions/manage-questions/manage-questions.component";
import { ManageQuestionsService } from "./questions/manage-questions/shared/manage-questions.service";

@NgModule({
  declarations: [
    ConfigurationManageQuestionsComponent,
    ConfigurationAddOrEditQuestionComponent
  ],
  imports: [
    ConfigurationRoutingModule,
    CommonModule,
    jqxComboBoxModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    ConfigurationAddQuestionService,
    ManageQuestionsService
  ]
})

export class ConfigurationModule{}

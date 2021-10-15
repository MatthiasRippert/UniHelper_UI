import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { jqxComboBoxModule } from 'jqwidgets-ng/jqxcombobox';
import { AnswerQuestionRoutingModule } from './answer-question-routing.module';
import { AnswerQuestionController } from './answer-question.component';
import { AnswerQuestionService } from './shared/answer-question.service';


@NgModule({
  declarations: [
    AnswerQuestionController
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AnswerQuestionRoutingModule,
    RouterModule,
    FormsModule,
    jqxComboBoxModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AnswerQuestionService
  ],
  bootstrap: []
})
export class AnswerQuestionModule { }

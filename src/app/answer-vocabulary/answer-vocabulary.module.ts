import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard.service';
import { CommonRequestService } from '../shared/common-request.service';
import { AnswerVocabularyRoutingModule } from './answer-vocabulary-routing.module';
import { AnswerVocabularyComponent } from './answer-vocabulary.component';
import { AnswerVocabularyService } from './shared/answer-vocabulary.service';


@NgModule({
  declarations: [
    AnswerVocabularyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AnswerVocabularyRoutingModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AnswerVocabularyService,
    CommonRequestService,
    AuthGuard
  ],
  bootstrap: []
})
export class AnswerVocabularyModule { }

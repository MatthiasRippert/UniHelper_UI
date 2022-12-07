import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { ShowImageInFullScreenComponent } from '../shared/show-image-in-full-screen/show-image-in-full-screen.component';
import { AnswerQuestionRoutingModule } from './answer-question-routing.module';
import { AnswerQuestionComponent } from './answer-question.component';
import { AnswerQuestionService } from './shared/answer-question.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    AnswerQuestionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AnswerQuestionRoutingModule,
    RouterModule,
    FormsModule,
    AngularFireStorageModule,
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    InputNumberModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AnswerQuestionService,
    AuthGuard
  ],
  bootstrap: []
})
export class AnswerQuestionModule { }

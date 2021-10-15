import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AnswerQuestionModule } from './answer-question/answer-question.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationModule } from './configuration/configuration.module';
import { NavigationComponent } from './nav/nav.component';
import { NavigationService } from './nav/shared/nav.service';
import { SubjectModule } from './subjects/subjects.module';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    SubjectModule,
    ConfigurationModule,
    AnswerQuestionModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    NavigationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

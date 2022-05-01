import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { AnswerQuestionModule } from './answer-question/answer-question.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationModule } from './configuration/configuration.module';
import { AuthGuard } from './guards/auth-guard.service';
import { UniHelperInterceptor } from './interceptor/uni-helper.interceptor';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthService } from './login-page/shared/login-page.service';
import { NavigationComponent } from './nav/nav.component';
import { NavigationService } from './nav/shared/nav.service';
import { SmallNavComponent } from './nav/small-nav/small-nav.component';
import { NotesModule } from './notes/notes.module';
import { SubjectModule } from './subjects/subjects.module';

export function tokenGetter(){
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    LoginPageComponent,
    AppComponent,
    NavigationComponent,
    SmallNavComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    SubjectModule,
    ConfigurationModule,
    AnswerQuestionModule,
    NotesModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBOgm_4hBUDb0DDyJQ0VrPU9KBKr4zGO7g",
      authDomain: "unihelper-4b137.firebaseapp.com",
      projectId: "unihelper-4b137",
      storageBucket: "unihelper-4b137.appspot.com",
      messagingSenderId: "628077704422",
      appId: "1:628077704422:web:02e664f922e6889335f727",
      measurementId: "G-CF68VGE2QR"
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001", "uni-helper-api.de"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    NavigationService,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniHelperInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

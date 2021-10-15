import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SubjectBiologyComponent } from "./biology/biology.component";
import { SubjectBusinessComponent } from "./business/business.component";
import { SubjectChemistryComponent } from "./chemistry/chemistry.component";
import { SubjectLanguageComponent } from "./language/language.component";
import { SubjectMathComponent } from "./math/math.component";
import { SubjectPhysicsComponent } from "./physics/physics.component";
import { SubjectsRoutingModule } from "./subjects-routing.module";

@NgModule({
  declarations: [
    SubjectChemistryComponent,
    SubjectBiologyComponent,
    SubjectMathComponent,
    SubjectLanguageComponent,
    SubjectBusinessComponent,
    SubjectPhysicsComponent
  ],
  imports: [
    SubjectsRoutingModule
  ],
  providers: [
  ]
})

export class SubjectModule{}

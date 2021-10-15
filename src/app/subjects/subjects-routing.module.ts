import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubjectBiologyComponent } from "./biology/biology.component";
import { SubjectBusinessComponent } from "./business/business.component";
import { SubjectChemistryComponent } from "./chemistry/chemistry.component";
import { SubjectLanguageComponent } from "./language/language.component";
import { SubjectMathComponent } from "./math/math.component";
import { SubjectPhysicsComponent } from "./physics/physics.component";

const routes: Routes = [
  {
    path: 'subject/chemistry',
    data: {
      title: 'Chemie'
    },
    component: SubjectChemistryComponent
  },
  {
    path: 'subject/physics',
    data: {
      title: 'Physik'
    },
    component: SubjectPhysicsComponent
  },
  {
    path: 'subject/biology',
    data: {
      title: 'Chemie'
    },
    component: SubjectBiologyComponent
  },
  {
    path: 'subject/business',
    data: {
      title: 'BWL'
    },
    component: SubjectBusinessComponent
  },
  {
    path: 'subject/math',
    data: {
      title: 'Mathe'
    },
    component: SubjectMathComponent
  },
  {
    path: 'subject/language',
    data: {
      title: 'Sprache'
    },
    component: SubjectLanguageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class SubjectsRoutingModule { }

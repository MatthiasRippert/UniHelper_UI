import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { jqxComboBoxModule } from "jqwidgets-ng/jqxcombobox";
import { AuthGuard } from "../guards/auth-guard.service";
import { CommonRequestService } from "../shared/common-request.service";
import { NotesRoutingModule } from "./notes-routing.module";
import { NotesComponent } from "./notes.component";
import { NoteService } from "./shared/notes.service";

@NgModule({
  declarations: [
    NotesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NotesRoutingModule,
    jqxComboBoxModule
  ],
  providers: [
    CommonRequestService,
    NoteService,
    AuthGuard
  ]
})

export class NotesModule{}

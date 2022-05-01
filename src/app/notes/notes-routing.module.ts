import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard.service';
import { NotesComponent } from './notes.component';

const routes: Routes = [
{
  path: 'notes',
  data: {
    title: 'Notizen'
  },
  component: NotesComponent,
  canActivate: [AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ShowImageInFullScreenComponent } from './show-image-in-full-screen/show-image-in-full-screen.component';

@NgModule({
  imports: [CommonModule],
  exports: [ShowImageInFullScreenComponent],
  declarations: [ShowImageInFullScreenComponent],
  providers: [],
})
export class SharedModule { }

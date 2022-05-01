import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'show-image-in-full-screen',
  templateUrl: './show-image-in-full-screen.component.html'
})

export class ShowImageInFullScreenComponent {
  show: boolean = false;
  imagePath: string;

  constructor() { }

  showImageInFullScreen(imagePath: string): void {
    this.show = true;
    this.imagePath = imagePath;
  }


}

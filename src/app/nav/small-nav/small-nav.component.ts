import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'small-nav',
  templateUrl: './small-nav.component.html'
})

export class SmallNavComponent implements OnInit {
  showConfigurationMenu = false;
  constructor() { }

  ngOnInit() { }
}

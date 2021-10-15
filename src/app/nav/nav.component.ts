import { Component, OnInit } from "@angular/core";
import { NavigationService } from "./shared/nav.service";

interface INavDropdownItem{
  idDropdownItem: number,
  descDropdownItem: string,
  disabled: boolean
}
interface INavItem{
  idNavItem: number,
  descNavItem: string,
  routeString: string,
  disabled: boolean,
  dropdownItems: INavDropdownItem[]

}
@Component({
    selector: 'navigation',
    templateUrl: './nav.component.html'
})

export class NavigationComponent implements OnInit {
    public navigation: any;

    public resolution: number;

    constructor(
      private navigationService: NavigationService
    ){}
    ngOnInit(): void {
      this.resolution = window.screen.width * window.devicePixelRatio;
      console.log("Resolution: ", this.resolution);
      this.getNavItems();
    }

    private getNavItems(){
      return this.navigationService.getNavigation().subscribe(nav => {
        this.navigation = nav;
        console.log("Nav: ", this.navigation);
      })
    }

}

import { Component } from "@angular/core";

@Component({
  selector: "app-logo",
  styles: [
    `
      .logo {
        font-weight: 600;
        font-size: 30px;
      }
    `,
  ],
  template: `<div
    [matTooltip]="'Go to homepage'"
    [matTooltipPosition]="'right'"
    [routerLink]="''"
    class="cursor-pointer my-3 logo text-center"
  >
    SIRP
  </div>`,
})
export class LogoComponent {}

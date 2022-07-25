import { Component } from "@angular/core";

@Component({
  selector: "app-publications-manage-component",
  template: `
    <div class="row">
      <div class="col-12 mx-auto">
        <app-publications-table [showAdd]="false"></app-publications-table>
      </div>
    </div>
  `,
})
export class PublicationsManageComponent {
  constructor() {}
}

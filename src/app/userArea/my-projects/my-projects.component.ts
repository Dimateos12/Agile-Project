import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-my-projects",
  template: `<div class="row">
    <div class="col-12 mx-auto">
      <app-projects-table [personal]="true"></app-projects-table>
    </div>
  </div>`,
})
export class MyProjectsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

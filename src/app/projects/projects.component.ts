import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-projects",
  template: ` <div class="row">
    <div class="col-12">
      <app-projects-table [public]="true"></app-projects-table>
    </div>
  </div>`,
})
export class ProjectsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

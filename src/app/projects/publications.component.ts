import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-publications",
  template: ` <div class="row">
    <div class="col-12">
      <app-publications-table [public]="true"></app-publications-table>
    </div>
  </div>`,
})
export class PublicationsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

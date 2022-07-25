import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-my-publications",
  template: `<div class="row">
    <div class="col-12 mx-auto">
      <app-publications-table [personal]="true"></app-publications-table>
    </div>
  </div>`,
  styles: [],
})
export class MyPublicationsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

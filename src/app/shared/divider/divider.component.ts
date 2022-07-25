import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-divider[marginY]",
  template: `<div [ngClass]="'my-' + marginY">
    <mat-divider></mat-divider>
  </div>`,
})
export class DividerComponent implements OnInit {
  constructor() {}

  @Input() marginY: 0 | 1 | 2 | 3 | 4 | 5 = 0;

  ngOnInit(): void {}
}

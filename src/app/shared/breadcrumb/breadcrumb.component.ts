import { Component, OnInit } from "@angular/core";
import { BreadcrumbService } from "xng-breadcrumb";

@Component({
  selector: "app-breadcrumb",
  template: `<section class="d-inline-block my-4">
    <xng-breadcrumb [separator]="iconTemplate"></xng-breadcrumb>
    <ng-template #iconTemplate>
      <mat-icon>chevron_right</mat-icon>
    </ng-template>
  </section> `,
  styleUrls: ["./breadcrumb.component.scss"],
})
export class BreadcrumbComponent implements OnInit {
  constructor(private breadcrumbSvc: BreadcrumbService) {}

  ngOnInit(): void {}
}

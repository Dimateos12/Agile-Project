import { ActivatedRoute } from "@angular/router";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-light-layout",
  styles: [
    `
      .layout-container {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }

      main {
        min-height: calc(100vh - var(--footer-height));
        padding-top: calc(var(--topbar-height) + 0.6rem);
        padding-bottom: calc(var(--footer-height) + 0.6rem);
      }
    `,
  ],
  template: `
    <div class="layout-container">
      <mat-drawer-container>
        <mat-drawer-content>
          <main
            [ngClass]="{ full: fullHeight }"
            class="d-flex flex-column container"
          >
          <router-outlet></router-outlet>
          </main>
          <app-footer></app-footer>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
export class AuthLayoutComponent implements OnInit {
  fullHeight = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fullHeight = this.route.snapshot.data["fullHeight"] == true;
  }
}

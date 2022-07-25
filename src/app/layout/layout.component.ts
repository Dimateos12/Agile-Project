import { Component, OnInit } from "@angular/core";
import { StoreService } from "../core/store/store.service";
import { AuthService } from "../core/services/auth.service";
import { User } from "../core/models/user";
import { Observable, tap } from "rxjs";

@Component({
  selector: "app-layout",
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
        min-height: calc(100vh - var(--footer-height) - var(--topbar-height));
        /* padding-top: calc(var(--topbar-height) + 0.6rem); */
        /* padding-bottom: calc(var(--footer-height) + 0.6rem); */
      }
    `,
  ],
  template: `
    <div class="layout-container">
      <div>
        <app-topbar [isAuthenticated]="isAuthenticated" [user]="user">
          <div class="d-block d-sm-none">
            <button
              sidenavToggle
              type="button"
              mat-button
              (click)="drawer.toggle()"
            >
              Toggle sidenav
            </button>
          </div>
        </app-topbar>
      </div>
      <mat-drawer-container>
        <mat-drawer #drawer mode="side">
          <ul>
            <li>
              <span
                class="me-3 user-info"
                *ngIf="user && user.profile?.firstName"
              >
                {{ user.profile.firstName }}
                {{ user.profile.lastName || "" }}</span
              >
            </li>
            <li><a mat-button>Researchers</a></li>
            <li><a mat-button>Projects</a></li>
            <li>
              <a mat-button routerLink="manage" *ngIf="isAuthenticated"
                >Personal Area</a
              >
            </li>
            <li>
              <a
                *ngIf="isAuthenticated; else notAuth"
                mat-button
                (click)="logout()"
              >
                <mat-icon>logout</mat-icon>
              </a>

              <ng-template #notAuth>
                <a mat-button routerLink="login">
                  <mat-icon>login</mat-icon>
                </a>
              </ng-template>
            </li>
          </ul>
        </mat-drawer>

        <mat-drawer-content>
          <main class="d-flex flex-column container">
            <app-breadcrumb></app-breadcrumb>
            <router-outlet></router-outlet>
          </main>
          <app-footer></app-footer>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
export class LayoutComponent implements OnInit {
  isAuthenticated = false;

  user!: User.UserUnion | null;

  constructor(private authSvc: AuthService, private storeSvc: StoreService) {}

  ngOnInit(): void {
    this.storeSvc.getState().subscribe((state) => {
      this.isAuthenticated = state?.isAuthenticated == true;
      if (state) {
        this.storeSvc
          .getUser()
          .pipe(tap((user) => (this.user = user)))
          .subscribe();
      }
    });
  }
  logout() {
    this.authSvc.logout();
  }
}

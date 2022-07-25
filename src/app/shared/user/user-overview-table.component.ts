import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Mongo } from "src/app/core/models/mongo";
import { Project } from "src/app/core/models/project";
import { User } from "src/app/core/models/user";
import { localeDate } from "src/app/core/utils/date";

@Component({
  selector: "app-user-overview-table",
  template: `
    <div class="scrollable-table">
      <table class="w-100" mat-table [dataSource]="users">
        <!--- Note that these columns can be defined in any order.
      The actual rendered columns are set as a property on the row definition" -->

        <!-- Position Column -->
        <ng-container matColumnDef="logo">
          <th mat-header-cell *matHeaderCellDef>Logo</th>
          <td mat-cell class="ps-0 cell-130" *matCellDef="let user">
            <app-identicon [seed]="user._id" [size]="100"></app-identicon>
          </td>
        </ng-container>

        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>id</th>
          <td mat-cell *matCellDef="let user" class="pe-2 cell-auto">
            {{ user._id }}
          </td>
        </ng-container>

        <ng-container matColumnDef="country">
          <th mat-header-cell *matHeaderCellDef>Country</th>
          <td mat-cell *matCellDef="let user" class="pe-2 cell-auto">
            {{ user.profile.country.name || "--" }}
          </td>
        </ng-container>

        <ng-container matColumnDef="roles">
          <th mat-header-cell *matHeaderCellDef>Role</th>
          <td mat-cell *matCellDef="let user" class="cell-150">
            <mat-chip-list>
              <mat-chip *ngIf="user.roles == 'funder'" selected color="primary"
                >Founder</mat-chip
              >
              <mat-chip *ngIf="user.roles == 'manager'" selected color="basic"
                >Manager</mat-chip
              >
              <mat-chip
                *ngIf="user.roles == 'researcher'"
                selected
                color="primary"
                >Researcher</mat-chip
              >
              <mat-chip *ngDefaultControl selected color="primary">{{
                user.roles
              }}</mat-chip>
            </mat-chip-list>
            <!--<td mat-cell *matCellDef="let user">{{ user.roles }}</td>-->
          </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell class="cell-150" *matCellDef="let user">
            {{ user.profile.firstName }}
          </td>
        </ng-container>

        <ng-container matColumnDef="surname">
          <th mat-header-cell *matHeaderCellDef>Surname</th>
          <td mat-cell class="cell-150" *matCellDef="let user">
            {{ user.profile.lastName }}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell class="cell-120" *matCellDef="let user">
            <button mat-icon-button>
              <mat-icon>visibility</mat-icon>
            </button>
            <button
              mat-icon-button
              class="ms-3"
              color="accent"
              (click)="$event.stopImmediatePropagation(); openDialog(user)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <!-- Name Column -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          [routerLink]="['', 'profile', row._id]"
          target="_blank"
          *matRowDef="let row; columns: displayedColumns"
        ></tr>
      </table>

      <ng-template #removeSubProjectTpl let-data>
        <h2 mat-dialog-title>Remove subproject</h2>

        <mat-dialog-content>
          Are you sure you want to remove
          <strong>{{ data.user._id }}</strong> from this project ?
        </mat-dialog-content>

        <mat-dialog-actions>
          <button mat-button mat-dialog-close>No</button>
          <button mat-raised-button color="warn" [mat-dialog-close]="true">
            Yes
          </button>
        </mat-dialog-actions>
      </ng-template>
    </div>
  `,
  styles: [
    `
      table {
        width: 100%;

        tr:hover {
          background-color: #f5f5f5;
          cursor: pointer;
        }
      }

      :host ::ng-deep .mat-form-field-wrapper {
        padding-bottom: 0;
      }
    `,
  ],
})
export class UserOverviewTableComponent implements OnInit {
  @Input()
  users!: User.User[];

  @Input()
  isOverview = false;

  @Input()
  limit!: number;

  @ViewChild("removeSubProjectTpl") RemoveSubProjectTpl!: TemplateRef<any>;

  @Output()
  remove = new EventEmitter<User.Researcher>();

  constructor(private router: Router, private dialog: MatDialog) {}

  displayedColumns: string[] = [
    "logo",
    "id",
    "country",
    "roles",
    "name",
    "surname",
  ];

  ngOnInit() {
    if (!this.isOverview) {
      this.displayedColumns.push("actions");
    }
  }

  localeDate(date: Mongo.Date) {
    return localeDate(date.$date, "MM/DD/yyyy");
  }

  openDialog(user: User.Researcher) {
    this.dialog
      .open(this.RemoveSubProjectTpl, {
        data: { user },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.remove.emit(user);
      });
  }
}

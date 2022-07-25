import { MatTableDataSource } from "@angular/material/table";
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
import { Publication } from "src/app/core/models/publication";
import { User } from "src/app/core/models/user";
import { localeDate } from "src/app/core/utils/date";

@Component({
  selector: "app-publication-user-overview-table",
  template: `
    <div class="scrollable-table">
      <table class="w-100" mat-table [dataSource]="usersDataSource">
        <!--- Note that these columns can be defined in any order.
      The actual rendered columns are set as a property on the row definition" -->

        <!-- Position Column -->
        <ng-container matColumnDef="logo">
          <th mat-header-cell *matHeaderCellDef>Logo</th>
          <td mat-cell class="ps-0 cell-130" *matCellDef="let user">
            <app-identicon
              [seed]="user.profile.firstName + user.profile.lastName"
              [size]="100"
            ></app-identicon>
          </td>
        </ng-container>

        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>Link</th>
          <td mat-cell *matCellDef="let user" class="pe-2 cell-auto">
            <a
              *ngIf="user.ORCID || user._id; else noData"
              (click)="$event.stopImmediatePropagation()"
              [attr.href]="user.ORCID || userLink(user._id)"
              target="_blank"
              >{{ user.ORCID || userLink(user._id) || "n/a" }}</a
            >
          </td>
        </ng-container>

        <ng-container matColumnDef="roles">
          <th mat-header-cell *matHeaderCellDef>Role</th>
          <td mat-cell *matCellDef="let user" style="width: 150px">
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
          <td mat-cell class="cell-auto" *matCellDef="let user">
            {{ user.profile.firstName }}
          </td>
        </ng-container>

        <ng-container matColumnDef="surname">
          <th mat-header-cell *matHeaderCellDef>Surname</th>
          <td mat-cell class="cell-auto" *matCellDef="let user">
            {{ user.profile.lastName }}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell style="width:120px" *matCellDef="let user">
            <button mat-icon-button>
              <mat-icon>visibility</mat-icon>
            </button>
            <button
              *ngIf="showDelete"
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
          target="_blank"
          *matRowDef="let row; columns: displayedColumns"
        ></tr>
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="4">No data found</td>
        </tr>
      </table>

      <ng-template #removeAuthorTpl let-data>
        <h2 mat-dialog-title>Remove subproject</h2>

        <mat-dialog-content>
          Are you sure you want to remove author
          <strong>{{ data.author.name }}</strong> from this project ?
        </mat-dialog-content>

        <mat-dialog-actions>
          <button mat-button mat-dialog-close>No</button>
          <button mat-raised-button color="warn" [mat-dialog-close]="true">
            Yes
          </button>
        </mat-dialog-actions>
      </ng-template>

      <ng-template #noData>
        <span>n/a</span>
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
export class PublicationUserOverviewTableComponent implements OnInit {
  @Input()
  users!: User.User[];

  usersDataSource!: MatTableDataSource<User.User>;

  @Input()
  isOverview = false;

  @Input()
  editable = false;

  @Input()
  showDelete = true;

  @ViewChild("removeAuthorTpl") RemoveAuthorTpl!: TemplateRef<any>;

  @Output()
  deleteEvent = new EventEmitter();

  constructor(private router: Router, private dialog: MatDialog) {}

  displayedColumns: string[] = ["logo", "name", "surname", "id"];

  ngOnInit() {
    this.usersDataSource = new MatTableDataSource(this.users);

    if (!this.isOverview && this.editable) {
      this.displayedColumns.push("actions");
    }
  }

  localeDate(date: Mongo.Date) {
    return localeDate(date.$date, "MM/DD/yyyy");
  }

  openDialog(author: Publication.Author) {
    this.dialog
      .open(this.RemoveAuthorTpl, {
        data: {
          author: author,
        },
      })
      .afterClosed()
      .subscribe((remove: boolean) => {
        if (remove) {
          this.deleteEvent.emit(author._id ?? true);
        }
      });
  }

  userLink(_id: any) {
    if (typeof _id === "string") {
      return window.location.origin + `/profile/${_id}`;
    } else {
      return;
    }
  }
}

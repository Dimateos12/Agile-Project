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
import { Project } from "src/app/core/models/project";
import { localeDate } from "src/app/core/utils/date";

@Component({
  selector: "app-project-overview-table",
  template: `
    <div class="scrollable-table" [ngClass]="{ 'mat-elevation-z8': elevated }">
      <table class="w-100 " mat-table [dataSource]="projectsDs">
        <!--- Note that these columns can be defined in any order.
      The actual rendered columns are set as a property on the row definition" -->

        <!-- Position Column -->
        <ng-container matColumnDef="logo">
          <th mat-header-cell *matHeaderCellDef>Logo</th>
          <td mat-cell class="ps-0 cell-130" *matCellDef="let project">
            <app-identicon [seed]="project.code" [size]="100"></app-identicon>
          </td>
        </ng-container>

        <ng-container matColumnDef="code">
          <th mat-header-cell *matHeaderCellDef>Code</th>
          <td mat-cell class="cell-80" *matCellDef="let project">
            {{ project.code }}
          </td>
        </ng-container>

        <ng-container matColumnDef="startingDate">
          <th mat-header-cell *matHeaderCellDef>Creation date</th>
          <td mat-cell class="cell-100" *matCellDef="let project">
            {{ localeDate(project.creationDate) }}
          </td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let project" class="pe-2 cell-auto">
            {{ project.title.withEllipsis(80) }}
          </td>
        </ng-container>

        <ng-container matColumnDef="owner">
          <th mat-header-cell *matHeaderCellDef>Owner</th>
          <td mat-cell class="cell-230" *matCellDef="let project">
            {{ project.owner._id }}
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell class="cell-80" *matCellDef="let project">
            <app-project-status-chip
              [project]="project"
            ></app-project-status-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell style="width:120px" *matCellDef="let project">
            <button mat-icon-button>
              <mat-icon>visibility</mat-icon>
            </button>
            <button
              mat-icon-button
              class="ms-3"
              color="accent"
              (click)="$event.stopImmediatePropagation(); openDialog(project)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <!-- Name Column -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          (click)="navigate(row)"
          *matRowDef="let row; columns: displayedColumns"
        ></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            No data found
          </td>
        </tr>
      </table>

      <ng-template #removeSubProjectTpl let-data>
        <h2 mat-dialog-title>Remove subproject</h2>

        <mat-dialog-content>
          Are you sure you want to remove sub-project
          <strong>{{ data.subProject.code }}</strong> from this project ?
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
export class ProjectOverviewTableComponent implements OnInit {
  @Input()
  projects!: Project.Project[];

  projectsDs!: MatTableDataSource<Project.Project>;

  @Input()
  isOverview = false;

  @Input()
  public = false;

  @Input()
  elevated = false;

  @Input()
  limit!: number;

  @ViewChild("removeSubProjectTpl") RemoveSubProjectTpl!: TemplateRef<any>;

  @Output()
  removeSubProjectEvent = new EventEmitter<Project.Project>();

  constructor(private router: Router, private dialog: MatDialog) {}

  displayedColumns: string[] = [
    "logo",
    "code",
    "startingDate",
    "title",
    "owner",
    "status",
  ];

  ngOnInit() {
    if (!this.isOverview) {
      this.displayedColumns.push("actions");
    }

    this.projectsDs = new MatTableDataSource(
      this.limit ? this.projects?.slice(0, this.limit) : this.projects
    );
  }

  localeDate(date: Mongo.Date) {
    return localeDate(date.$date, "MM/DD/yyyy");
  }

  openDialog(subProject: Project.Project) {
    this.dialog
      .open(this.RemoveSubProjectTpl, {
        data: { subProject },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.removeSubProjectEvent.emit(subProject);
      });
  }

  navigate(row: Project.Project) {
    this.router.navigate(
      this.public
        ? ["/", "projects", row._id.$oid]
        : ["/", "manage", "projects", row._id.$oid],
      {
        replaceUrl: true,
      }
    );
  }
}

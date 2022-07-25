import { Publication } from "./../../../../core/models/publication";
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
  selector: "app-publication-overview-table",
  template: `
    <div class="scrollable-table" [ngClass]="{ 'mat-elevation-z8': elevated }">
      <table mat-table [dataSource]="publicationsDataSource">
        <!--- Note that these columns can be defined in any order.
        The actual rendered columns are set as a property on the row definition" -->

        <!-- Position Column -->
        <ng-container matColumnDef="logo">
          <th mat-header-cell *matHeaderCellDef>Logo</th>
          <td
            mat-cell
            class="ps-0"
            *matCellDef="let publication"
            style="width: 150px"
          >
            <app-identicon
              [seed]="publication.DOI || publication.internal_DOI"
              [size]="100"
            ></app-identicon>
          </td>
        </ng-container>

        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell class="cell-180" *matCellDef="let publication">
            <mat-chip-list>
              <mat-chip
                *ngIf="publication.type === publicationType['journal-article']"
                selected
                color="primary"
                >Journal Article</mat-chip
              >
              <mat-chip
                *ngIf="publication.type === publicationType['book-chapter']"
                selected
                color="basic"
                >Book chapter
              </mat-chip>

              <mat-chip
                *ngIf="
                  publication.type === publicationType['proceedings-article']
                "
                selected
                color="basic"
              ></mat-chip>
            </mat-chip-list>
          </td>
        </ng-container>

        <ng-container matColumnDef="DOI">
          <th mat-header-cell *matHeaderCellDef>DOI</th>
          <td mat-cell class="cell-200" *matCellDef="let publication">
            {{ publication.DOI || publication.internal_DOI }}
          </td>
        </ng-container>

        <ng-container matColumnDef="creationDate">
          <th mat-header-cell *matHeaderCellDef>Creation date</th>
          <td mat-cell *matCellDef="let publication" class="cell-150">
            {{ publication.internal.creationDate.$date | date: "MM/dd/YYY" }}
          </td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let publication" class="cell-auto">
            {{ publication.title?.withEllipsis(100) }}
          </td>
        </ng-container>

        <ng-container matColumnDef="owner">
          <th mat-header-cell *matHeaderCellDef>Owner</th>
          <td mat-cell *matCellDef="let publication">
            {{ publication.owner._id }}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef style="width: 120px">
            Actions
          </th>
          <td mat-cell *matCellDef="let publication">
            <button mat-icon-button [routerLink]="[publication._id.$oid]">
              <mat-icon>visibility</mat-icon>
            </button>
            <button
              *ngIf="!public"
              mat-icon-button
              class="ms-3"
              color="accent"
              (click)="
                $event.stopPropagation(); openDialog(publication._id.$oid)
              "
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

      <ng-template #removeEntityTpl let-data>
        <h2 mat-dialog-title>Remove publication</h2>

        <mat-dialog-content>
          Are you sure you want to remove <strong>publication</strong> from this
          project ?
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
export class PublicationOverviewTableComponent implements OnInit {
  @Input()
  publications!: Publication.Publication[];

  publicationsDataSource!: MatTableDataSource<Publication.Publication>;

  @Input()
  isOverview = false;

  @Input()
  public = false;

  @Input()
  elevated = true;

  @Input()
  limit!: number;

  @ViewChild("removeEntityTpl") removeEntityTpl!: TemplateRef<any>;

  @Output()
  removeEvent = new EventEmitter<string>();

  publicationType = Publication.TYPE;

  constructor(private router: Router, private dialog: MatDialog) {}

  displayedColumns: string[] = ["logo", "title", "type", "DOI", "creationDate"];

  ngOnInit() {
    if (!this.isOverview) {
      this.displayedColumns.push("actions");
    }

    this.publicationsDataSource = new MatTableDataSource(
      this.limit ? this.publications?.slice(0, this.limit) : this.publications
    );
  }

  localeDate(date: Mongo.Date) {
    return localeDate(date.$date, "MM/DD/yyyy");
  }

  openDialog(id: string) {
    this.dialog
      .open(this.removeEntityTpl)
      .afterClosed()
      .subscribe((result) => {
        if (result) this.removeEvent.emit(id);
      });
  }

  navigate(row: Project.Project) {
    this.router.navigate(["/", "publications", row._id.$oid], {
      replaceUrl: true,
    });
  }
}

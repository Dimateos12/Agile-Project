import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Publication } from "src/app/core/models/publication";

@Component({
  selector: "app-publication-reference-table",
  template: `
    <div class="scrollable-table">
      <table class="w-100" mat-table [dataSource]="dataSource">
        <ng-container
          *ngFor="let col of displayedColumns"
          [matColumnDef]="col.key"
        >
          <th mat-header-cell *matHeaderCellDef>{{ col.label }}</th>
          <td mat-cell class="cell-auto" *matCellDef="let link">
            {{ link[col.key] }}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell style="width:120px" *matCellDef="let user">
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

        <ng-template #removeTpl let-data>
          <h2 mat-dialog-title>Remove reference</h2>

          <mat-dialog-content>
            Are you sure you want to remove <strong>reference</strong> from this
            project ?
          </mat-dialog-content>

          <mat-dialog-actions>
            <button mat-button mat-dialog-close>No</button>
            <button mat-raised-button color="warn" [mat-dialog-close]="true">
              Yes
            </button>
          </mat-dialog-actions>
        </ng-template>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row target="_blank" *matRowDef="let row; columns: cols"></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="100">No data found</td>
        </tr>
      </table>

      <ng-template #noData>
        <span>n/a</span>
      </ng-template>
    </div>
    <mat-paginator
      [pageSizeOptions]="[5, 10, 25, 100]"
      aria-label="Select page of users"
    ></mat-paginator>
  `,
  styles: [
    `
      table {
        width: 100%;
        min-width: 1920px;

        th {
          min-width: 120px;
          padding: 0.5rem;
        }
        td {
          padding: 0.5rem;
        }

        tr:hover {
          background-color: #f5f5f5;
          cursor: pointer;
        }
      }
    `,
  ],
})
export class PublicationReferenceTableComponent {
  @Input()
  data!: Publication.Reference[];

  @Input()
  editable = false;

  @Output()
  deleteEvent = new EventEmitter();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild("removeTpl") removeTpl!: TemplateRef<any>;

  dataSource: MatTableDataSource<Publication.Reference> =
    new MatTableDataSource();

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    if (this.editable) {
      this.fixedCols.push({ key: "actions", label: "Actions" });
    }
  }

  displayedColumns: { key: string; label: string }[] = [
    { key: "key", label: "Key" },
    { key: "unstructured", label: "Unstructured" },
    { key: "first-page", label: "First-Page" },
    { key: "article-title", label: "Article-Title" },
    { key: "volume", label: "Volume" },
    { key: "author", label: "Author" },
    { key: "year", label: "Year" },
    { key: "journal-title", label: "Journal-Title" },
    { key: "series-title", label: "Series-Title" },
    { key: "doi-asserted-by", label: "Doi-Asserted-By" },
    { key: "DOI", label: "DOI" },
    { key: "issue", label: "Issue" },
  ];

  fixedCols: { key: string; label: string }[] = [];

  get cols(): string[] {
    return [...this.displayedColumns, ...this.fixedCols].map((c) => c.key);
  }

  openDialog(reference: Publication.Reference) {
    this.dialog
      .open(this.removeTpl, {
        data: {
          reference: reference,
        },
      })
      .afterClosed()
      .subscribe((remove: boolean) => {
        if (remove) {
          this.deleteEvent.emit(reference._id);
        }
      });
  }
}

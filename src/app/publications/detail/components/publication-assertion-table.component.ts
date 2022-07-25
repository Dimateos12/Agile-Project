import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Publication } from "src/app/core/models/publication";

@Component({
  selector: "app-publication-assertion-table",
  template: `
    <div class="scrollable-table">
      <table class="w-100" mat-table [dataSource]="dataSource">
        <!--- Note that these columns can be defined in any order.
      The actual rendered columns are set as a property on the row definition" -->

        <ng-container matColumnDef="label">
          <th mat-header-cell *matHeaderCellDef>Label</th>
          <td mat-cell *matCellDef="let assertion" class="pe-2 cell-auto">
            {{ assertion.label }}
          </td>
        </ng-container>

        <ng-container matColumnDef="value">
          <th mat-header-cell *matHeaderCellDef>Value</th>
          <td mat-cell class="cell-auto" *matCellDef="let assertion">
            {{ assertion.value }}
          </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell class="cell-auto" *matCellDef="let assertion">
            {{ assertion.name }}
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
          <h2 mat-dialog-title>Remove assertion</h2>

          <mat-dialog-content>
            Are you sure you want to remove <strong>assertion</strong> from this
            project ?
          </mat-dialog-content>

          <mat-dialog-actions>
            <button mat-button mat-dialog-close>No</button>
            <button mat-raised-button color="warn" [mat-dialog-close]="true">
              Yes
            </button>
          </mat-dialog-actions>
        </ng-template>

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
export class PublicationAssertionTableComponent {
  @Input()
  data!: Publication.Assertion[];

  @Input()
  editable = false;

  @Output()
  deleteEvent = new EventEmitter();

  @ViewChild("removeTpl") removeTpl!: TemplateRef<any>;

  dataSource: MatTableDataSource<Publication.Assertion> =
    new MatTableDataSource();

  constructor(private dialog: MatDialog) {}

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

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.data);
    if (this.editable) {
      this.displayedColumns.push("actions");
    }
  }

  displayedColumns: string[] = ["label", "value", "name"];
}

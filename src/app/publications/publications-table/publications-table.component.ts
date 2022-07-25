import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { UserService } from "src/app/core/services/user.services";

import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSelectChange } from "@angular/material/select";
import { forkJoin, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Mongo } from "src/app/core/models/mongo";
import { Project } from "src/app/core/models/project";
import { SnackbarService } from "src/app/core/services/snackbar.service";
import { localeDate } from "src/app/core/utils/date";
import { DeleteProjectDialogComponent } from "src/app/delete-project-dialog/delete-project-dialog.component";
import { User } from "src/app/core/models/user";
import { StoreService } from "src/app/core/store/store.service";
import { PublicationCreateDialogComponent } from "../dialogs/create-publication/publication-add-dialog.component";
import { PublicationService } from "src/app/core/services/publication.service";
import { Publication } from "src/app/core/models/publication";

interface ProjectFilters {
  code: string | null;
  owner: string | null;
  title: string | null;
  status: string | null;
}
@Component({
  selector: "app-publications-table",
  templateUrl: "./publications-table.component.html",
  styleUrls: ["./publications-table.component.scss"],
})
export class PublicationsTableComponent implements OnInit {
  @Input()
  public = false;

  @Input()
  personal = false;

  @Input()
  hideFilters = false;

  @Input()
  elevated = true;

  @Input()
  forUser!: string;

  @Input()
  limit!: number;

  @Input()
  showAdd = true;

  publications!: MatTableDataSource<Publication.Publication>;

  $owners!: Observable<User.Researcher[]>;

  publicationType = Publication.TYPE;

  loading = true;

  filters: ProjectFilters = {
    code: null,
    owner: null,
    title: null,
    status: null,
  };

  public statusOptions = Object.values(Project.STATUS);

  projectStatus = Project.STATUS;

  displayedColumns: string[] = ["logo", "title", "type", "DOI", "creationDate"];

  resultsLength = 0;
  pageSize = 15;

  $userId!: Observable<string | null>;

  isManager = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private publicationSvc: PublicationService,
    private userSvc: UserService,
    private storeSvc: StoreService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.paginator?.page
      .pipe(
        tap(() => {
          this.getFilteredData(this.paginator.pageIndex + 1);
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.get();
    this.$owners = this.userSvc.getResearchers();

    if (!this.public) {
      this.displayedColumns.push("actions");
    }
  }

  getFilteredData(page = 1) {
    this.get(
      this.cleanFilter({ ...this.filters, owner: { _id: this.filters.owner } }),
      page
    );
  }

  get(filter: any = null, page = 1) {
    this.storeSvc
      .getUser()
      .pipe(
        tap((user) => {
          this.isManager = (user && this.userSvc.isManager(user)) || false;
        }),
        map((user) => user?._id ?? null),
        tap((userId) => {
          if (this.personal)
            filter = { ...filter, "internal.createdBy": { _id: userId } };
          if (this.forUser)
            filter = { ...filter, "internal.createdBy": { _id: this.forUser } };
        })
      )
      .subscribe(() => {
        forkJoin([
          this.publicationSvc.get(filter, page, this.pageSize).pipe(
            tap((response) => {
              this.publications = new MatTableDataSource(response);
            })
          ),
          this.publicationSvc
            .size(filter)
            .pipe(tap((size) => (this.resultsLength = size))),
        ]).subscribe();
      });
  }

  delete(id: string) {
    this.publicationSvc
      .delete(id)
      .pipe(
        tap(() => {
          this.ngOnInit();
          this.snackBarService.open("Publication has been deleted");
        })
      )
      .subscribe();
  }

  statusChanged($event: MatSelectChange) {
    this.filters["status"] = $event.value;
  }

  openDialog(project: Project.Project) {
    this.dialog
      .open(DeleteProjectDialogComponent, {
        data: {
          project: project,
        },
      })
      .afterClosed()
      .subscribe((cancel: boolean) => {
        if (cancel) {
          this.delete(project._id.$oid);
        }
      });
  }

  resetFilter() {
    this.get();
    this.filters.code = null;
    this.filters.title = null;
    this.filters.owner = null;
    this.filters.status = null;
  }

  anyFilterSet(): boolean {
    return (
      this.filters.code != null ||
      this.filters.title != null ||
      this.filters.owner != null ||
      this.filters.status != null
    );
  }

  cleanFilter(filter: any): any {
    if (filter.code === null) delete filter.code;
    if (filter.title === null) delete filter.title;
    if (filter.status === null) delete filter.status;
    if (filter.owner?._id === null) delete filter.owner;

    return Object.keys(filter).length > 0 ? filter : null;
  }

  localeDate(date: Mongo.Date) {
    return localeDate(date.$date, "MM/DD/yyyy");
  }

  createPublication(owners: User.Researcher[]) {
    this.dialog.open(PublicationCreateDialogComponent, {
      data: { owners },
    });
  }

  navigate(row: Project.Project) {
    if (this.isManager) {
      this.router.navigate(["/manage/publications", row._id.$oid]);
    } else {
      this.router.navigate(
        this.personal
          ? ["/", "account", "publications", row._id.$oid]
          : ["/", "publications", row._id.$oid],
        {
          replaceUrl: true,
        }
      );
    }
  }
}

import { MatTableDataSource } from "@angular/material/table";
import { StoreService } from "./../../../core/store/store.service";
import { UserService } from "src/app/core/services/user.services";
import { ProjectCreateDialogComponent } from "./../project-create-dialog/project-create-dialog.component";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSelectChange } from "@angular/material/select";
import { forkJoin, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Mongo } from "src/app/core/models/mongo";
import { Project } from "src/app/core/models/project";
import { ProjectService } from "src/app/core/services/manager/project.service";
import { SnackbarService } from "src/app/core/services/snackbar.service";
import { localeDate } from "src/app/core/utils/date";
import { DeleteProjectDialogComponent } from "src/app/delete-project-dialog/delete-project-dialog.component";
import { User } from "src/app/core/models/user";

interface ProjectFilters {
  code: string | null;
  owner: string | null;
  title: string | null;
  status: string | null;
}
@Component({
  selector: "app-projects-table",
  templateUrl: "./projects-table.component.html",
  styleUrls: ["./projects-table.component.scss"],
})
export class ProjectsTableComponent implements OnInit {
  @Input()
  public = false;
  @Input()
  personal = false;

  projects!: MatTableDataSource<Project.Project>;

  $owners!: Observable<User.Researcher[]>;

  projectType = Project.TYPE;

  loading = true;

  filters: ProjectFilters = {
    code: null,
    owner: null,
    title: null,
    status: null,
  };

  public statusOptions = Object.values(Project.STATUS);

  projectStatus = Project.STATUS;

  displayedColumns: string[] = [
    "logo",
    "type",
    "code",
    "startingDate",
    "title",
    "owner",
    "status",
    "actions",
  ];

  resultsLength = 0;
  pageSize = 15;

  $userId!: Observable<string | null>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private projectService: ProjectService,
    public userSvc: UserService,
    private storeSvc: StoreService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService
  ) {}

  ngAfterViewInit() {
    this.paginator.page
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
        map((user) => user?._id ?? null),
        tap((userId) => {
          if (this.personal) filter = { ...filter, owner: { _id: userId } };
        })
      )
      .subscribe(() => {
        forkJoin([
          this.projectService.get(filter, page, this.pageSize).pipe(
            tap((response) => {
              this.projects = new MatTableDataSource(response);
            })
          ),
          this.projectService
            .size(filter)
            .pipe(tap((size) => (this.resultsLength = size))),
        ]).subscribe();
      });
  }

  delete(id: string) {
    this.projectService
      .delete(id)
      .pipe(
        tap(() => {
          this.ngOnInit();
          this.snackBarService.open("Project has been deleted");
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

  createProject(owners: User.Researcher[]) {
    this.dialog.open(ProjectCreateDialogComponent, {
      data: { owners },
    });
  }
}

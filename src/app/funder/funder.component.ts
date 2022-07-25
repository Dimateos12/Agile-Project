import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from "src/app/core/models/project";
import { User } from "src/app/core/models/user";
import { ProjectService } from '../core/services/manager/project.service';
import { UserService } from '../core/services/user.services';
import { tap } from "rxjs/operators";
import { forkJoin, Observable, startWith, switchMap } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { localeDate } from '../core/utils/date';
import { Mongo } from '../core/models/mongo';


@Component({
  selector: 'app-funder',
  templateUrl: './funder.component.html',
  styleUrls: ['./funder.component.scss']
})
export class FunderComponent implements OnInit {
 
  projects!: Project.Project[];

  $owners!: Observable<User.Researcher[]>;

  displayedColumns: string[] = [
    "title",
    "owner",
    "startingDate",
    "status",
    "budget"
  ];

  resultsLength = 0;
  pageSize = 4;

@ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private projectService: ProjectService,
    public userSvc: UserService,
  ) { }


  ngOnInit(): void {
    this.get();
    this.$owners = this.userSvc.getResearchers();
 }

get(filter: any = null, page = 1) {
  forkJoin([
    this.projectService.get(filter, page, this.pageSize).pipe(
      tap((response) => {
        this.projects = response;
      })
    ),
    this.projectService
      .size(filter)
      .pipe(tap((size) => (this.resultsLength = size))),
  ]).subscribe();
}


localeDate(date: Mongo.Date) {
  return localeDate(date.$date, "MM/DD/yyyy");
}



}

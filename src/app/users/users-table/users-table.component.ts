import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSelectChange } from "@angular/material/select";
import { forkJoin, tap } from "rxjs";
import { User } from "src/app/core/models/user";
import { UserService } from "src/app/core/services/user.services";
import { Country } from "src/app/core/utils/country";

interface UsersFilters {
  firstName: string | null;
  lastName: string | null;
  _id: string | null;
  country: string | null;
  roles: string | null;
}

@Component({
  selector: "app-users-table",
  templateUrl: "./users-table.component.html",
  styleUrls: ["./users-table.component.scss"],
})
export class UsersTableComponent implements OnInit {
  users!: User.User[];

  userRole = Object.values(User.USER_ROLES);

  filters: UsersFilters = {
    firstName: null,
    lastName: null,
    _id: null,
    country: null,
    roles: null,
  };

  public countryOptions = Object.values(Country);
  public userRoles = Object.values(User.USER_ROLES);
  displayedColumns: string[] = [
    "photo",
    "name",
    "surname",
    "roles",
    "mail",
    "country",
    "actions",
  ];

  resultsLength = 0;
  pageSize = 15;

  constructor(private userService: UserService) {}

  getFilteredData() {
    this.filterUsers(this.cleanFilter({ ...this.filters }));
  }

  filterUsers(filter?: any) {
    console.log(filter);
    if(filter.firstName != null || filter.lastName != null|| filter.country != null){
    const filters = {'profile.firstName': filter.firstName,'profile.lastName': filter.lastName,'profile.country': filter.country ,_id: filter._id,roles: filter.roles};
    this.userService
      .getFilteredUser(JSON.stringify(filters))
      .pipe(
        tap((response) => {
          this.users = response;
        })
      )
      .subscribe();
    }else{
      this.userService
      .getFilteredUser(JSON.stringify(filter))
      .pipe(
        tap((response) => {
          this.users = response;
        })
      )
      .subscribe();
    }
  }

  get() {
    forkJoin([
      this.userService.getResearchers().pipe(
        tap((response) => {
          this.users = response;
        })
      ),
    ]).subscribe();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  statusChanged($event: MatSelectChange) {
    this.filters["country"] = $event.value;
  }

  roleChanged($event: MatSelectChange) {
    this.filters["roles"] = $event.value;
  }

  cleanFilter(filter: any): any {
    if (filter.firstName === null) delete filter.firstName;
    if (filter.lastName === null) delete filter.lastName;
    if (filter.country === null) delete filter.country;
    if (filter._id === null) delete filter._id;
    if (filter.roles === null) delete filter.roles;

    return Object.keys(filter).length > 0 ? filter : null;
  }

  ngOnInit(): void {
    this.get();
  }
  resetFilter() {
    this.get();
    this.filters.firstName = null;
    this.filters.lastName = null;
    this.filters.country = null;
    this.filters._id = null;
    this.filters.roles = null;
  }
  anyFilterSet(): boolean {
    return (
      this.filters.firstName != null ||
      this.filters.lastName != null ||
      this.filters.country != null ||
      this.filters._id != null ||
      this.filters.roles != null
    );
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => {
          this.getFilteredData();
        })
      )
      .subscribe();
  }
}

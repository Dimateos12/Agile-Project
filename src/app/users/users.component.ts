import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { State, StoreService } from "../core/store/store.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  state$!: Observable<State | null>;

  constructor(private storeSvc: StoreService) {}

  ngOnInit(): void {
    this.state$ = this.storeSvc.getState();
  }


}



import { AuthService } from "./core/services/auth.service";
import { StoreService } from "./core/store/store.service";
import { Component, OnInit } from "@angular/core";

import './core/utils/string';

@Component({
  selector: "app-root",
  template: `<router-outlet></router-outlet>`,
  styles: [``],
})
export class AppComponent implements OnInit {
  title = "si-research-fe";

  constructor(private storeSvc: StoreService, private authSvc: AuthService) {
    this.storeSvc.loadState();
  }

  async ngOnInit(): Promise<void> {}
}

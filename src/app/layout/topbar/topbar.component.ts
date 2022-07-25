import { UserService } from "src/app/core/services/user.services";
import { User } from "./../../core/models/user";
import { StoreService } from "./../../core/store/store.service";
import { AuthService } from "./../../core/services/auth.service";
import { Component, Input, OnInit } from "@angular/core";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent implements OnInit {
  @Input() isAuthenticated = false;
  @Input() user!: User.UserUnion | null;

  constructor(private authSvc: AuthService, public userSvc: UserService) {}

  closeTimeout!: number;

  ngOnInit(): void {}

  logout() {
    this.authSvc.logout();
  }

  openMenu(trigger: any) {
    clearTimeout(this.closeTimeout);
    trigger.openMenu();
  }

  autoCloseMenu(trigger: MatMenuTrigger, time: number = 1000) {
    this.closeTimeout = setTimeout(() => {
      trigger.closeMenu();
    }, 1000);
  }
  closeMenu(menu: MatMenu) {
    this.closeTimeout = setTimeout(() => {
      menu.closed.emit();
    }, 1000);
  }

  deb() {
    console.log("enter overlay");
  }
}

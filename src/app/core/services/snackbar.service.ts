import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  open(message: string, action: string = "x", duration: number = 4000) {
    this.snackbar.open(message, action, {
      duration,
      panelClass: ["cy-snackbar"],
    });
  }
}

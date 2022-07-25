import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-edit-btn-group",
  template: ` <button class="me-2" *ngIf="edit" (click)="cancel.emit()" mat-button>
      Cancel
    </button>
    <button
      *ngIf="true"
      (click)="edit ? save.emit() : toggleEdit.emit()"
      class=""
      mat-button
      mat-raised-button
      [color]="!edit ? 'basic' : 'primary'"
    >
      {{ edit ? "Save" : "Edit" }}
    </button>`,
})
export class EditBtnGroupComponent implements OnInit {
  @Input() edit = false;

  @Output() cancel = new EventEmitter(false);
  @Output() save = new EventEmitter(false);
  @Output() toggleEdit = new EventEmitter(false);

  constructor() {}

  ngOnInit(): void {}
}

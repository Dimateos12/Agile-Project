import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Component, Input, OnInit } from "@angular/core";
import { toSvg } from "jdenticon";

@Component({
  selector: "app-identicon",
  template: `<div *ngIf="svg" [innerHtml]="svg"></div>`,
})
export class IdenticonComponent implements OnInit {
  @Input() seed!: string;
  @Input() size = 100;

  svg: SafeHtml | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.svg = this.sanitizer.bypassSecurityTrustHtml(
      toSvg(this.seed, this.size)
    );
  }
}

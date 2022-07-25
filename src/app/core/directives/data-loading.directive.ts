import { MatProgressSpinner } from "@angular/material/progress-spinner";
import {
  ComponentFactoryResolver,
  Directive,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from "@angular/core";
import { ElementRef } from "@angular/core";

@Directive({
  selector: "[dataLoading]",
})
export class SpinnerButtonDirective implements OnInit, OnChanges {
  // tslint:disable-next-line:no-input-rename
  @Input() dataLoading = false;
  originalInnerText!: string;
  originalInnerHtml!: string;
  spinner!: MatProgressSpinner;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    // Create the spinner
    const componentRef =
      this.viewContainerRef.createComponent(MatProgressSpinner);

    this.spinner = componentRef.instance;

    // Configure the spinner
    this.spinner.strokeWidth = 3;
    this.spinner.diameter = 30;
    this.spinner.mode = "indeterminate";

    const loader = this.renderer.createElement("div");
    this.renderer.addClass(loader, "d-flex");
    this.renderer.addClass(loader, "justify-content-center");
    this.renderer.addClass(loader, "mt-3");

    // Hide the spinner
    this.renderer.setStyle(
      this.spinner._elementRef.nativeElement,
      "display",
      this.dataLoading ? "inherit" : "none"
    );

    this.renderer.appendChild(loader, this.spinner._elementRef.nativeElement);
    this.renderer.appendChild(this.el.nativeElement, loader);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      typeof changes["dataLoading"] === "object" &&
      !changes["dataLoading"].isFirstChange()
    ) {
      if (changes["dataLoading"].currentValue === true) {
        // Show the spinner
        this.renderer.setStyle(
          this.spinner._elementRef.nativeElement,
          "display",
          "inherit"
        );

        // Hide the button
        const children = this.el.nativeElement.children;
        this.setChildrenDisplay(children, "none");
      }

      if (changes["dataLoading"].currentValue === false) {
        // Hide the spinner
        this.renderer.setStyle(
          this.spinner._elementRef.nativeElement,
          "display",
          "none"
        );

        // Show the button
        const children = this.el.nativeElement.children;
        this.setChildrenDisplay(children, "unset");
      }
    }
  }

  setChildrenDisplay(children: any, display: "unset" | "none") {
    for (let child of children) {
      this.renderer.setStyle(child, "display", display);
    }
  }
}

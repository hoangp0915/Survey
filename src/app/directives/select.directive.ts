import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSelect]'
})
export class SelectDirective {
  constructor(private el: ElementRef) {}
  @HostListener('focus') onFocus() {
    this.el.nativeElement.setSelectionRange(0, this.el.nativeElement.value.length);
  }
}

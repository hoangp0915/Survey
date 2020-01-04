import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSelect]'
})
export class SelectDirective {
  constructor(private el: ElementRef) {
  }

  // @HostListener('mouseenter') onMouseEnter() {

  //   console.log("TCL: SelectDirective -> @HostListener -> element",  this.el)
  // }

  @HostListener('click') onClick() {
    // this.el.nativeElement.selectionStart = 0;
    // this.el.nativeElement.selectionEnd = this.el.nativeElement.value.length;
    // this.el.nativeElement.forcus();
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 500);
    this.el.nativeElement.setSelectionRange(0, this.el.nativeElement.value.length);

    console.log('TCL: SelectDirective -> @HostListener -> this.el', this.el);
  }




}

import { Directive, Input, ElementRef, Renderer2, OnChanges } from '@angular/core';

@Directive({
	selector: '[appFontSize]'
})
export class FontSizeDirective implements OnChanges {
	@Input('appFontSize') currentBreakpoint: string = '';

	constructor(private el: ElementRef, private renderer: Renderer2) {}

	ngOnChanges(): void {}

	adjustFontSize() {
		switch (this.currentBreakpoint) {
			case 'large':
				this.renderer.setStyle(this.el.nativeElement, 'font-size', '16px');
				break;
			case 'tablet':
				this.renderer.setStyle(this.el.nativeElement, 'font-size', '14px');
				break;
			case 'medium':
				this.renderer.setStyle(this.el.nativeElement, 'font-size', '14px');
				break;
			case 'handset':
				this.renderer.setStyle(this.el.nativeElement, 'font-size', '12px');
				break;
			default:
				this.renderer.setStyle(this.el.nativeElement, 'font-size', 'inherit');
		}
	}
}

import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
	selector: 'ng-template[templateName]'
})
export class NgTemplateNameDirective {
	@Input() templateName!: string;

	constructor(public templateRef: TemplateRef<any>) {}
}

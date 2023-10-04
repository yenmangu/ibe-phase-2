import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appEmitData]'
})
export class EmitDataDirective {

  @Output() emitData = new EventEmitter<any>();

	constructor() {}

	@HostListener('passData', ['$event'])
	onEmitData(data: any) {
		this.emitData.emit(data);
	}

}

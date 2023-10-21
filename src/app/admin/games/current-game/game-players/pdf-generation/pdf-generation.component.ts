import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-pdf-generation',
	templateUrl: './pdf-generation.component.html',
	styleUrls: ['./pdf-generation.component.scss']
})
export class PdfGenerationComponent implements OnInit {
	@Input() tableData: any;

	formData: any = {};

	constructuctor() {}

	ngOnInit(): void {
		console.log('data in display component: ', this.tableData);
	}
}

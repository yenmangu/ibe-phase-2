import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { Papa } from 'ngx-papaparse';

export interface HeaderMapping {
	input: string[];
	output: string[];
}
@Injectable({
	providedIn: 'root'
})
export class CsvService {
	csvFilePath: string = '../../../assets/data/csv/membership_20230905.csv';
	csvData: any = [];
	headerData: string[] = [];
	delimiter: string = '';

	constructor(private http: HttpClient, private papa: Papa) {}

	// Dev

	getDevCsvData(): Observable<any> {
		const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
		return this.http
			.get(this.csvFilePath, { headers, responseType: 'text' })
			.pipe(map((response: any) => response as string));
	}

	// Live

	async extractHeaders(csvData: string): Promise<string[] | null> {
		try {
			const rows = csvData.split(/\r\n|\n/);
			if (rows.length === 0) {
				return null;
			}
			const headerRow = rows[0];
			const delimiters = [',', ';', '\t', '|'];
			const detectedDelimiter = delimiters.find(
				delimiter => headerRow.split(delimiter).length > 1
			);
			if (detectedDelimiter) {
				this.delimiter = detectedDelimiter;
				const headers = headerRow.split(detectedDelimiter);
				return headers;
			}
			return null;
		} catch (error) {
			console.error('Error: ', error);
			return null;
		}
	}

	get getDelimiter() {
		return this.delimiter;
	}

	async parseCsvData(csvData: string): Promise<any> {
		try {
			console.log('Papa parse started');

			const output = this.papa.parse(csvData);
			if (output) {
				return output;
			} else {
				console.error('Error with papa parse');
			}
		} catch (error) {
			throw error;
		}
	}

	transformCsv(
		parsedCSV: string[][],
		headerMapping: { [key: string]: HeaderMapping }
	): string[][] {
		const transformedCSV: string[][] = [];

		const headerRow = parsedCSV[0];

		const transformedHeaderRow: string[] = [];

		for (const key in headerMapping) {
			const mapping = headerMapping[key];

			mapping.output.forEach(outputHeader => {
				transformedHeaderRow.push(outputHeader);
			});
		}
		transformedCSV.push(transformedHeaderRow);

		for (let i = 1; i < parsedCSV.length; i++) {
			const dataRow = parsedCSV[i];
			const transformedDataRow: string[] = [];

			for (const key in headerMapping) {
				const mapping = headerMapping[key];
				const values: string[] = [];
				mapping.input.forEach(inputHeader => {
					const columnIndex = headerRow.indexOf(inputHeader);
					if (columnIndex !== -1) {
						values.push(dataRow[columnIndex]);
					}
				});
				const transformedValue = values.join(' ');
				transformedDataRow.push(transformedValue);
			}
			transformedCSV.push(transformedDataRow);
		}
		return transformedCSV;
	}
}


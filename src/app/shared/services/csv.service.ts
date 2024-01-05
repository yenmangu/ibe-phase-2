import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class CsvService {
	csvFilePath: string = '../../../assets/data/csv/membership_20230905.csv';
	csvData: any = [];
	headerData: string[] = [];

	constructor(private http: HttpClient) {}

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
				const headers = headerRow.split(detectedDelimiter);
				return headers;
			}
			return null;
		} catch (error) {
			console.error('Error: ', error);
			return null;
		}
	}
}

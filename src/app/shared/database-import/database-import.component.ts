import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CsvService } from '../services/csv.service';
import { HeaderMapping } from '../services/csv.service';
import { HttpService } from '../services/http.service';
import { switchMap, tap, Observable, catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
@Component({
	selector: 'app-database-import',
	templateUrl: './database-import.component.html',
	styleUrls: ['./database-import.component.scss']
})
export class DatabaseImportComponent implements OnInit {
	@Output() signalMapping: EventEmitter<boolean> = new EventEmitter<boolean>();

	selectedFiles: any[] = [];
	uploaded: boolean = false;
	fileToMap: any | null = null;
	readyForMapping: boolean = true;

	uploadedHeaders: any[] = [];
	selectedMapping: { [key: string]: HeaderMapping } | null = null;
	detectedDelimiter: string = '';
	clearImport: boolean = false;
	fileAsString: string = '';
	csvFile: any = '';

	trandsformedCSV: string[][] = [];

	gameCode: string = '';
	dirKey: string = '';

	meta: any = {};
	importStart: boolean = false;
	importSuccess: boolean | null = false;

	testMapping: { [key: string]: HeaderMapping } = {
		'0': {
			input: ['FIRSTNAME', 'SURNAME'],
			output: ['Name (First Name + Surname)']
		},
		'1': { input: ['EMAIL', 'EMAIL'], output: ['Email'] },
		'2': { input: ['PHONE'], output: ['Phone'] },
		'3': { input: ['HCAP'], output: ['Handicap'] },
		'4': { input: ['EBU'], output: ['EBU'] },
		'5': { input: ['BBOUSERNAME'], output: ['BBO Username'] }
	};
	constructor(
		private csvService: CsvService,
		private httpService: HttpService,
		private snackbar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirKey = localStorage.getItem('DIR_KEY');
	}

	onFileListChange(files: any[]) {
		this.clearImport = false;
		this.selectedFiles = files;
		this.signalMapping.emit(true);
		this.uploadedHeaders = [];
		console.log('File list: ', this.selectedFiles);
	}

	receiveFile(eventData: boolean) {
		this.readyForMapping = eventData;
		this.fileToMap = this.selectedFiles[0];
		console.log(this.readyForMapping);
		if (this.fileToMap) {
			const fileReader = new FileReader();
			fileReader.onload = e => {
				const fileContent = fileReader.result as string;
				console.log('file content: ', fileContent);
				this.fileAsString = fileContent;
				this.extractHeaders(this.fileAsString);
			};
			fileReader.readAsText(this.fileToMap);
		}
	}

	async extractHeaders(fileString) {
		try {
			const headers = await this.csvService.extractHeaders(fileString);
			if (headers.length > 0) {
				this.uploadedHeaders = headers;
				this.readyForMapping = true;
			} else {
				this.readyForMapping = false;
			}
		} catch (error) {
			console.error('error readng file and extracting headers');
		}
	}

	simulateFile() {
		this.csvService.getDevCsvData().subscribe({
			next: async data => {
				try {
					this.fileAsString = data;
					const headers = await this.csvService.extractHeaders(data);
					console.log('headers: ', headers);
					if (headers.length > 0) {
						this.uploadedHeaders = headers;
						this.readyForMapping = true;
					} else {
						this.readyForMapping = false;
					}
				} catch (error) {}
			},
			error: error => {
				console.error('error: ', error);
			}
		});
	}

	handleUploadedHeaders(headers: any) {}

	async handleImport(mapping: any) {
		console.log(
			'Event Emitter triggered the handleImport method in demo page component with: ',
			mapping
		);

		if (Object.keys(mapping).length > 0) {
			this.importStart = true;
			this.selectedMapping = mapping;
			this.detectedDelimiter = this.csvService.getDelimiter;
			console.log('selected mapping: ', this.selectedMapping);
		}

		try {
			console.log('Attempting to parse: ', this.fileAsString);

			const parsedData = await this.csvService.parseCsvData(this.fileAsString);

			console.log('parsed data from live: ', parsedData);
			this.meta = parsedData.meta;

			const transformedCsvString = this.csvService.transformCsv(
				parsedData.data,
				this.selectedMapping
			);
			if (transformedCsvString) {
				this.trandsformedCSV = transformedCsvString;
				console.log('transformed csv: ', transformedCsvString);
				this.importToRemote(this.trandsformedCSV).subscribe({
					next: response => {
						console.log('response from api: ', response);
						if (response.serverResponse.success) {
							this.importSuccess = true;
						} else {
							this.openSnackbar(
								'Error importing database: ',
								undefined,
								response.serverResponse.error
							);
						}
					},
					error: error => {
						console.error('Error from api: ', error);
					}
				});
			}
		} catch (error) {
			console.error('Error parsing CSV data');
		}
	}

	openSnackbar(message: string, noContact?, error?): void {
		this.snackbar
			.openFromComponent(CustomSnackbarComponent, {
				data: { message, error, noContact }
			})
			.afterDismissed()
			.subscribe({
				next: () => {
					this.importStart = false;
					this.importSuccess = null;
				},
				error: error => {
					console.error(error);
				}
			});
	}

	importToRemote(importData): Observable<any> {
		const payload: any = {
			gameCode: this.gameCode,
			dirKey: this.dirKey,
			importData,
			meta: this.meta
		};
		console.log(JSON.stringify(payload, null, 2));

		return this.httpService.importPlayerDatabase(payload);
	}

	receiveCancel(signal) {
		this.clearImport = true;
	}

	async dbImportTest() {
		try {
			this.importStart = true;
			this.csvService
				.getDevCsvData()
				.pipe(
					switchMap(async result => {
						const parsedData = await this.csvService.parseCsvData(result);
						this.meta = parsedData.meta;
						console.log('Parsed dev data: ', parsedData);
						const transformedCsvString = this.csvService.transformCsv(
							parsedData.data,
							this.testMapping
						);
						console.log('DB Import test transformed CSV: ', transformedCsvString);
						return transformedCsvString;
					}),
					switchMap(transformedCSV => {
						return this.importToRemote(transformedCSV).pipe(
							tap(response => {
								console.log('Import response: ', response);
								if (response.serverResponse.success) {
									this.importSuccess = true;
									console.log('SUCCESS');
								} else {
									this.importSuccess = false;
								}
							}),
							catchError(error => {
								throw error;
							})
						);
					})
				)
				.subscribe({
					next: () => {},
					error: error => {
						console.error('Error in subscription from remote: ', error);
					}
				});
		} catch (error) {
			console.error('Error processing dev CSV: ', error);
		}
	}
}

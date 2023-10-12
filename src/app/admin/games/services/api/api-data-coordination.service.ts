import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, lastValueFrom, tap } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { ApiDataProcessingService } from './api-data-processing.service';

@Injectable({
	providedIn: 'root'
})
export class ApiDataCoordinationService {
	constructor(
		private apiDataProcessing: ApiDataProcessingService,
		private httpService: HttpService
	) {}

	public async invokeAPICoordination(data: any): Promise<any> {
		try {
			await this.sendToHttp(data);
		} catch (err) {
			throw err;
		}
	}

	private async sendToHttp(data): Promise<any> {
		try {

			const processedData = await this.apiDataProcessing.processData(data);
			if (!processedData) {
				throw new Error('No data returned from apiDataProcessing');
			}
			// Debug
			// console.log(
			// 	'data from processData: ',
			// 	JSON.stringify(processedData, null, 2)
			// );
			// return;
			const response = await firstValueFrom(
				await this.httpService.postData(processedData).pipe(
					tap(response => {
						console.log(response);
					})
				)
			);
			console.log(response);
			return response;
		} catch (err) {
			throw err;
		}
	}
}

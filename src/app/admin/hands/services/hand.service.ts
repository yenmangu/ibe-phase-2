import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProcessHandsService } from './process-hands.service';
// import

@Injectable({
	providedIn: 'root'
})
export class HandService {
	private currentHandPageSubject = new BehaviorSubject<number>(1);
	currentHandPage$ = this.currentHandPageSubject.asObservable();
	private selectedMatchType: string = 'pairs';

	constructor(private processHands: ProcessHandsService) {}

	updateCurrentHandPage(page: number) {
		this.currentHandPageSubject.next(page);
	}

	async processCurrentHand(handPage) {
		console.log('processCurrentHand invoked');

		try {
			if (!handPage || handPage === null) {
				throw new Error('Undefined or null handPage parameter');
			}
			const handDataIndex = handPage - 1;
			const entireGame = await this.processHands.getCurrentHands(
				this.selectedMatchType
			);
			if (entireGame) {
				console.log('entire game: ', entireGame);

				const currentHand = entireGame.value[handDataIndex];
				console.log('current hand: ', currentHand);
				const handArray = currentHand._.split(' ');
				return handArray;
			} else {
				throw new Error('Entire gave not found');
			}
		} catch (error) {
			console.error('Error processing current hand', error);
			throw error;
		}
	}
}

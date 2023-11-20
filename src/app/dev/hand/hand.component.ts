import { Component, OnInit } from '@angular/core';
import { HandService } from 'src/app/admin/hands/services/hand.service';
import handData from '../../../assets/data/hand_data.json';
import arrayOfHands from '../../../assets/data/arrayOfHands.json';
// import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';

@Component({
	selector: 'app-hand',
	templateUrl: './hand.component.html',
	styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {
	entireGame: any = {};
	gameArray: any[] = [];
	arrayOfCards: string[] = [];
	currentHandCards: string[] | string = [];
	currentHandPage: number = 1;
	currentHandData: string[] = [];
	totalPages: number;
	constructor(private handService: HandService) {}

	ngOnInit(): void {
		this.handService.updateCurrentHandPage(this.currentHandPage);
		this.handService.currentHandPage$.subscribe(async page => {
			console.log('current hand page: ', page);
			this.currentHandPage = page;
			this.entireGame = handData;
			this.arrayOfCards = arrayOfHands;
			this.gameArray = this.entireGame.value;
			this.totalPages = this.gameArray.length;
			console.log(this.gameArray);

			this.currentHandData = await this.fetchCurrentHand(page);
			this.currentHandCards = await this.fetchCardArray(page);
			console.log('whole card array: ', arrayOfHands);
			
      console.log('current hand cards: ', this.currentHandCards);

			const cardArray = this.splitCards(this.currentHandCards)
			console.log(cardArray);

		});
	}

	async fetchCurrentHand(pageValue) {
		const handIndex = pageValue - 1;
		const currentHand = this.gameArray[handIndex];
		const currentHandData = currentHand._.split(' ');

		return currentHandData;
	}

	async fetchCardArray(pageValue) {
		const currentCardArray = this.arrayOfCards[pageValue - 1];
		return currentCardArray;
	}

	splitCards(cardString){
		let resultsArray = []
		console.log('card string in splitCards: ', cardString);
		console.log('cardString length: ', cardString.length);


		for(let i = 0; i < cardString.length; i += 2){
			const pair = cardString.slice(i, i+2);
			resultsArray.push(pair)
		}
		return resultsArray
	}

	async fetchHandData(pageValue) {
		try {
			this.currentHandData = await this.handService.processCurrentHand(pageValue);
			console.log('current hand data: ', this.currentHandData);
		} catch (error) {
			console.error('Error displaying handData: ', error);
			this.showError(error);
		}
	}
	showError(error) {}
}

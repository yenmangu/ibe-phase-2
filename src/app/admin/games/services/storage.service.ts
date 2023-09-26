import { Injectable } from '@angular/core';
import { IndexedDatabaseService } from './indexed-database.service';

@Injectable({
	providedIn: 'root'
})
export class StorageService {
	constructor() {}

	storeCurrentGameData(data) {
    const {
      siteauthresponse: {
        currentgamedata,
        hist,
        hands,
        handanxs,
        playerdb,
        params,
        xmlsettings
      }
    } = data;

		console.log(currentgamedata);
		console.log(hist);

		localStorage.setItem('current_game_data', currentgamedata);
		localStorage.setItem('hist', hist);
		localStorage.setItem('hands', hands);
		localStorage.setItem('handanxs', handanxs);
		localStorage.setItem('playerdb', playerdb);
		localStorage.setItem('params', params);
		localStorage.setItem('xml_settings', xmlsettings);


		// localStorage.setItem('current_match',data)
		// localStorage.setItem('current_game_data', data.siteauthresponse.currentgamedata)
		// localStorage.setItem(,data.siteauthresponse.)
	}

	














}

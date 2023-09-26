import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
	providedIn: 'root'
})
export class IndexedDatabaseService {
	private db: IDBPDatabase;

	constructor() {
		this.initDatabase();
	}

	async initDatabase() {
		this.db = await openDB('ibe-db', 1, {
			upgrade(db) {
				if (!db.objectStoreNames.contains('current_game_data')) {
					db.createObjectStore('current_game_data', { keyPath: 'id' });
				}
			}
		});
	}

	async addData(data: any) {
		const tx = this.db.transaction('current_game_data', 'readwrite');
		const store = tx.objectStore('current_game_data');
		await store.add(data);
		await tx.done;
	}

  async getData(id: any){
    const tx = this.db.transaction('current_game_data', 'readonly')
    const store = tx.objectStore('current_game_data')
    return store.get(id)
  }
}

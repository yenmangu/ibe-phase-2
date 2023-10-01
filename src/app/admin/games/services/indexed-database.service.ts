import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, IDBPTransaction, StoreNames, DBSchema } from 'idb';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';

@Injectable({
	providedIn: 'root'
})
export class IndexedDatabaseService {
	private db: IDBPDatabase | null = null;

	constructor(private indexedDatabaseStatus: IndexedDatabaseStatusService) {}

	async initDatabase(
		storeMapping: Record<string, any>,
		dbName: string
	): Promise<IDBPDatabase<unknown>> {
		try {
			const storeNames = Object.keys(storeMapping);
			// console.log('initDatabase storemapping: ', storeNames);

			this.db = await openDB(dbName, 2, {
				upgrade(db, oldVersion, newVersion, transaction) {
					if (oldVersion < 1) {
						if (!db.objectStoreNames.contains('meta')) {
							db.createObjectStore('meta', { keyPath: 'id' });
						}
					}

					// console.log('init db storeMapping keys', storeNames);
					for (const storeName of storeNames) {
						// console.log('for..of storeName: ',storeName)
						if (!db.objectStoreNames.contains(storeName)) {
							db.createObjectStore(storeName, { keyPath: 'key' });
							// console.log(storeName, 'created');
						} else {
							// console.log(storeNames, 'created, skipping store creation');
						}
					}
				}
			});
			// console.log('initDB finished');
			this.indexedDatabaseStatus.setStatus(true);
			console.log()
			return this.db;
		} catch (err) {
			console.error('Error initialising database', err);
			return err;
		}
	}
	async doesDatabaseExist(dbName){
		const databaseNames = await indexedDB.databases();
		return databaseNames.some(dbInfo => dbInfo.name === dbName)
	}

	async initialiseWithGameData(
		storeMapping: Record<string, any>,
		dbName: string
	): Promise<boolean> {
		try {
			const data = Object.keys(storeMapping);
			if (this.db === null) {
				console.log('Database not init, initialising database');
				this.db = await this.initDatabase(data, dbName);
			} else {
				// console.log('database created');
			}

			const tx = this.db.transaction(['meta'], 'readwrite');
			// console.log(JSON.stringify(tx, null, 2));
			const metaStore = tx.objectStore('meta');
			// console.log(JSON.stringify(metaStore, null, 2));

			if (metaStore) {
				await metaStore.put({ id: 'initialised', value: true });
				// console.log('metastore created', metaStore);
			} else {
				throw new Error('Meta store is not defined');
			}

			const storeNames = Object.keys(storeMapping);
			await this.addInitialData(storeMapping, storeNames);
			// Dynamically create object stores based on storeMapping keys
			return true;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	private async createInitialObjectStores(
		storeMapping: Record<string, any>
	): Promise<void> {
		// console.log('createObject storeMapping: ', storeMapping);
		const storeNames = Object.keys(storeMapping);
		for (const storeName of storeNames) {
			if (!this.db.objectStoreNames.contains(storeName)) {
				this.db.createObjectStore(storeName, { keyPath: 'key' });
			}
			console.log(storeName, ' created');
		}
	}

	private async addInitialData(
		storeMapping: Record<string, any>,
		storeNames: string[]
	): Promise<Record<string, any>> {
		const tx = this.db.transaction(storeNames, 'readwrite');
		for (const storeName of storeNames) {
			const store = tx.objectStore(storeName);
			const keys = Object.keys(storeMapping[storeName]);

			const promises = keys.map(async key => {
				const value = storeMapping[storeName][key];

				const existingData = await store.get(key);

				if (existingData === undefined) {
					const dataToStore = { key, value };
					await store.add(dataToStore);
				} else {
					return;
				}
			});
			await Promise.all(promises);
		}
		await tx.done;
		return storeMapping;
	}

	public async readFromDB(storeNames: string[], key: string) {
		try {
			if (!this.db) {
				throw new Error('Database is not initialised');
			}
			const data = {};

			for (const storeName of storeNames) {
				const tx = this.db.transaction(storeName, 'readonly');
				const store = tx.objectStore(storeName);
				data[storeName] = await store.get(key);
			}
			return data;
		} catch (err) {
			console.error('Error retrieving data:', err);
			throw err;
		}
	}

	public async writeToDB(
		dataToWriteArray: {
			storeName: string;
			key: string;
			value: any;
		}[]
	) {
		try {
			if (!this.db) {
				throw new Error('Database is not initialised');
			}
			const tx = this.db.transaction(
				dataToWriteArray.map(data => data.storeName),
				'readwrite'
			);
			for (const dataToWrite of dataToWriteArray) {
				const store = tx.objectStore(dataToWrite.storeName);
				await store.put({ key: dataToWrite.key, value: dataToWrite.value });
			}
			await tx.done;
		} catch (err) {
			console.error('Error writing data: ', err);
			throw err;
		}
	}
}

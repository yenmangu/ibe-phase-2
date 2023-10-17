import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, IDBPTransaction, StoreNames, DBSchema } from 'idb';
import { Subject } from 'rxjs';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';

@Injectable({
	providedIn: 'root'
})
export class IndexedDatabaseService {
	private db: IDBPDatabase | null = null;

	private exitSignal$ = new Subject<void>();

	constructor(private indexedDatabaseStatus: IndexedDatabaseStatusService) {}

	async initDatabase(
		storeMapping: Record<string, any>,
		playerDbStoreMapping: Record<string, any>,
		dbName: string
	): Promise<IDBPDatabase<unknown>> {
		let dataInitialized = false; // Flag to track data initialisation
		try {
			const storeNames = Object.keys(storeMapping);
			const playerDbStoreNames = Object.keys(playerDbStoreMapping);
			const maxVersion = 3;
			console.log('initDatabase storemapping: ', storeNames);

			this.db = await openDB(dbName, maxVersion, {
				upgrade(db, oldVersion, newVersion, transaction) {
					if (oldVersion < 1) {
						console.log('old version less than 1');

						if (!db.objectStoreNames.contains('meta')) {
							console.log('db containr meta');

							db.createObjectStore('meta', { keyPath: 'id' });
						}
					}

					// console.log('init db storeMapping keys', storeNames);
					for (const storeName of storeNames) {
						// console.log('for..of storeName: ',storeName)
						if (!db.objectStoreNames.contains(storeName)) {
							db.createObjectStore(storeName, { keyPath: 'key' });
							console.log(storeName, ': created');
						}
					}
					for (const name of playerDbStoreNames) {
						if (!db.objectStoreNames.contains(name)) {
							db.createObjectStore(name, { keyPath: 'key' });
							console.log(name, ': created');
						}
					}
				}
			});

			this.indexedDatabaseStatus.setStatus(true);
			console.log('database initialised successfully');

			return this.db;
		} catch (err) {
			console.error('Error initialising database', err);
			this.indexedDatabaseStatus.setStatus(false);
			return err;
		}
	}
	async doesDatabaseExist(dbName, expectedStores): Promise<boolean> {
		const databaseNames = await indexedDB.databases();
		if (databaseNames.some(dbInfo => dbInfo.name === dbName)) {
			this.db = await openDB(dbName);
			const actual = Array.from(this.db.objectStoreNames);
			return expectedStores.every(expected => actual.includes(expected));
		}
		return false;
	}

	// async isDBready(expectedStoreNames: string[]):Promise<boolean> {
	// 	try {
	// 		const storeNamesJSON = localStorage.getItem('STORE_NAMES');
	// 		if(!storeNamesJSON){
	// 			return false
	// 		}
	// 		const storeNamesArray = JSON.parse(storeNamesJSON);

	// 		for (const name of storeNamesArray{

	// 		})

	// 	} catch (err) {
	// 		throw new Error('Error checking database against existing store names')
	// 	}
	// }

	async initialiseWithGameData(
		storeMapping: Record<string, any>,
		playerDbStoreMapping: Record<string, any>,
		dbName: string,
		totalStores
	): Promise<boolean> {
		try {
			const data = Object.keys(storeMapping);
			const playerDbData = Object.keys(playerDbStoreMapping);
			if (this.db === null) {
				console.log('Database not init, initialising database');
				this.db = await this.initDatabase(
					storeMapping,
					playerDbStoreMapping,
					dbName
				);
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
			const playerDbStoreNames = Object.keys(playerDbStoreMapping);
			console.log(
				'store names: ',
				storeNames,
				'playerDbStoreNames: ',
				playerDbStoreNames
			);
			await this.addInitialData(
				storeMapping,
				playerDbStoreMapping,
				storeNames,
				playerDbStoreNames,
				progress => this.indexedDatabaseStatus.setProgress(totalStores, progress)
			);
			// Dynamically create object stores based on storeMapping keys
			return true;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	private async addInitialData(
		storeMapping: Record<string, any>,
		playerDbStoreMapping: Record<string, any>,
		storeNames: string[],
		playerDbStoreNames: string[],
		progressCallBack: (progress: number) => void
	): Promise<Record<string, any>> {
		const allStoreNames = storeNames.concat(playerDbStoreNames);
		const tx = this.db.transaction(allStoreNames, 'readwrite');
		try {
			const promises = [];
			let progress = 0;

			for (const name of playerDbStoreNames) {
				let id = 1;
				let key = `00${id}`;
				try {
					const store = tx.objectStore(name);
					if (!store) {
						console.log('No Store');
						throw new Error(`store: ${name} not found for player_db`);
					}
					for (const element of playerDbStoreMapping[name]) {
						const value = element;
						const existingData = await store.get(key);
						// console.log('key: ', key);

						if (existingData === undefined) {
							const dataToStore = { key, value };
							const promise = store.add(dataToStore);
							promises.push(promise);
						}
						id++;
						key = `00${id}`;
					}
					progress++;
					progressCallBack(progress);
				} catch (err) {
					console.error(`error processing player store ${name}: ${err}`);
				}
			}

			// process other stores

			for (const storeName of storeNames) {
				try {
					const store = tx.objectStore(storeName);
					if (!store) {
						console.log('no store for: ', storeName);
						throw new Error(`No store for ${storeName}`);
					}
					if (storeName === 'lock') {
						const key = 'lock';
						const value = storeMapping.lock;
						const existingData = await store.get(key);
						if (existingData === undefined) {
							const dataToStore = { key, value };
							const promise = store.add(dataToStore);
							promises.push(promise);
						}
					} else if (storeName === 'hand_data' || storeName === 'hrev_txt') {
						console.log(`processing ${storeName} differently: `);
						let dataToStore = { key: '', value: '' };
						if (storeName === 'hand_data') {
							dataToStore = { key: 'hands', value: storeMapping[storeName] };
						}
						if (storeName === 'hrev_txt') {
							dataToStore = { key: 'hrev', value: storeMapping[storeName] };
						}

						const existingData = await store.get('root');
						if (existingData === undefined) {
							const promise = store.add(dataToStore);
							promises.push(promise);
						}
					} else {
						const keys = Object.keys(storeMapping[storeName]);

						for (const key of keys) {
							const value = storeMapping[storeName][key];
							const existingData = await store.get(key);

							if (existingData === undefined) {
								const dataToStore = { key, value };
								const promise = store.add(dataToStore);
								promises.push(promise);
							}
						}
					}
				} catch (err) {
					console.error(`error processing game data store ${storeName}: ${err}`);
				}
				progress++;
				progressCallBack(progress);
			}

			await Promise.all(promises);
			await tx.done;
			return storeMapping;
		} catch (err) {
			console.error(`Error in addInitialData(): ${err}`);
			throw err;
		}
	}

	public async getAllDataFromStore(storeName: string) {
		try {
			const tx = this.db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);

			const data = await store.getAll();

			return data;
		} catch (error) {
			console.error(`Error retrieving data from ${storeName}:`, error);
			throw error;
		}
	}

	public async getByKey(storeName: string, key: string) {
		try {
			if (!this.db) {
				throw new Error('no db');
			}
			const tx = this.db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			const data = await store.get(key);
			if (data) {
				return data;
			} else {
				throw new Error(`No data in store for key: ${key}`);
			}
		} catch (err) {
			throw err;
		}
	}

	public async getAllKeys(storeName): Promise<any> {
		try {
			if (!this.db) {
				throw new Error('No database found');
			}
			const tx = this.db.transaction(storeName, 'readonly');
			const store = tx.objectStore(storeName);
			const keys = await store.getAllKeys();
			await tx.done;
			return keys;
		} catch (err) {
			throw err;
		}
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

	public async update(
		storeName: string,
		key: any,
		updatedValue: any
	): Promise<void> {
		try {
			if (!this.db) {
				throw new Error('Database is not initialized');
			}

			const tx = this.db.transaction(storeName, 'readwrite');
			const store = tx.objectStore(storeName);

			// Update the existing data with the new value
			await store.put({ key, value: updatedValue });

			// Complete the transaction
			await tx.done;
		} catch (error) {
			console.error(`Error updating data in ${storeName}:`, error);
			throw error;
		}
	}
	public async add(storeName: string, key: any, value: any): Promise<void> {
		try {
			if (!this.db) {
				throw new Error('Database is not initialized');
			}

			const tx = this.db.transaction(storeName, 'readwrite');
			const store = tx.objectStore(storeName);

			// Insert the new data
			await store.add({ key, value });

			// Complete the transaction
			await tx.done;
		} catch (error) {
			console.error(`Error adding data to ${storeName}:`, error);
			throw error;
		}
	}

	public async delete(storeName: string, key: string): Promise<any> {
		try {
			if (!this.db) {
				throw new Error('Database not initialised');
			}
			const tx = this.db.transaction(storeName, 'readwrite');
			const store = tx.objectStore(storeName);

			const completionPromise = new Promise<void>((resolve, reject) => {
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			});
			store.delete(key);
			await completionPromise;
		} catch (err) {
			throw err;
		}
	}

	async deleteIndexedDBDatabase(databaseName: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			console.log('low level delete promise made: deleting database', databaseName);

			const request = indexedDB.open(databaseName);
			request.onsuccess = event => {
				const db = request.result;
				db.close();
				const deleteRequest = indexedDB.deleteDatabase(databaseName);

				deleteRequest.onsuccess = () => {
					console.log(
						`Promise resolved, IndexedDB database '${databaseName}' deleted successfully`
					);
					resolve();
				};

				deleteRequest.onerror = () => {
					console.error(`Error deleting IndexedDB database '${databaseName}'`);
					reject(
						new Error(`Failed to delete IndexedDB database '${databaseName}'`)
					);
				};
				request.onerror = event => {
					reject(new Error(`Failed to open IndexedDB database '${databaseName}'`));
				};
			};
		});
	}
}

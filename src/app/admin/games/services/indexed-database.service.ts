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
		playerDbStoreMapping: Record<string, any>,
		dbName: string
	): Promise<IDBPDatabase<unknown>> {
		try {
			const storeNames = Object.keys(storeMapping);
			const playerDbStoreNames = Object.keys(playerDbStoreMapping);
			const maxVersion = 3;
			console.log('initDatabase storemapping: ', storeNames);

			this.db = await openDB(dbName, maxVersion, {
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
			return this.db;
		} catch (err) {
			console.error('Error initialising database', err);
			return err;
		}
	}
	async doesDatabaseExist(dbName) {
		const databaseNames = await indexedDB.databases();
		return databaseNames.some(dbInfo => dbInfo.name === dbName);
	}

	async initialiseWithGameData(
		storeMapping: Record<string, any>,
		playerDbStoreMapping: Record<string, any>,
		dbName: string
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
				playerDbStoreNames
			);
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
		playerDbStoreMapping: Record<string, any>,
		storeNames: string[],
		playerDbStoreNames: string[]
	): Promise<Record<string, any>> {
		const allStoreNames = [...storeNames, ...playerDbStoreNames];
		const tx = this.db.transaction(allStoreNames, 'readwrite');

		try {
			const promises = [];
			for (const name of playerDbStoreNames) {
				// console.log('playerdb store name', name);
				try {
					// console.log('finding store: ', name);
					const store = tx.objectStore(name);
					if (!store) {
						console.log('no store');
						return new Error('no store');
					} else {
						// console.log(store);
					}
					for (const element of playerDbStoreMapping[name]) {
						const key = element.$.n;
						const value = element;
						const existingData = await store.get(key);
						if (existingData === undefined) {
							const dataToStore = { key, value };
							const promise = store.add(dataToStore);
							promises.push(promise);
						} else {
							continue;
						}
					}
				} catch (error) {
					console.error(`Error processing player store ${name}:`, error);
				}
			}

			for (const storeName of storeNames) {
				try {
					const store = tx.objectStore(storeName);
					const keys = Object.keys(storeMapping[storeName]);
					// console.log('keys for store', storeName, ': ', keys);

					const storePromises = keys.map(async key => {
						const value = storeMapping[storeName][key];

						const existingData = await store.get(key);

						// console.log('normal store key and value: ', key, value);

						if (existingData === undefined) {
							const dataToStore = { key, value };
							const promise = store.add(dataToStore);
							return promise;
						} else {
							// Skip this iteration and continue to the next one
							return undefined; // Returning undefined here to indicate that the promise is not added
						}
					});
					promises.push(...storePromises.filter(promise => promise !== undefined));
					// console.log(promises);
				} catch (error) {
					console.error(`Error processing store ${storeName}:`, error);
				}
			}

			await Promise.all(promises);
			await tx.done;
			return storeMapping;
		} catch (err) {
			return Error('err', err);
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

	deleteIndexedDBDatabase(databaseName: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {

			const deleteRequest = indexedDB.deleteDatabase(databaseName);

			deleteRequest.onsuccess = () => {
				console.log(`IndexedDB database '${databaseName}' deleted successfully`);
				resolve();
			};

			deleteRequest.onerror = () => {
				console.error(`Error deleting IndexedDB database '${databaseName}'`);
				reject(new Error(`Failed to delete IndexedDB database '${databaseName}'`));
			};
		});
	}
}

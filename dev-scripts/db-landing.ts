	// private processData(data: any): void {
	// 	if (data && data.item) {
	// 		console.log('process data being called');
	// 		const dataArray: any[] = data.item;
	// 		this.playersArray = [];
	// 		this.teamsArray = [];
	// 		this.venuesArray = [];
	// 		this.eventArray = [];

	// 		dataArray.forEach((item: any) => {
	// 			if (item.$.type) {
	// 				switch (item.$.type) {
	// 					case 'player':
	// 						this.playersArray.push(item);
	// 						break;
	// 					case 'team':
	// 						this.teamsArray.push(item);
	// 						break;
	// 					case 'loc':
	// 						this.venuesArray.push(item);
	// 						break;
	// 					case 'event':
	// 						this.eventArray.push(item);
	// 						break;
	// 				}
	// 			}
	// 		});
	// 	}
	// }
	// async handleDataUpdate(updatedData: any) {
	// 	try {
	// 		console.log('emitted data in handle update: ', updatedData);
	// 		if (updatedData && updatedData.$.type) {
	// 			const type = updatedData.$.type;
	// 			await this.historicDatabaseService.updateByType(type, updatedData);
	// 			const newData = await this.loadDatabaseData();
	// 			if (newData) {
	// 				this.processData(newData);
	// 				this.changeDetectorRef.detectChanges();
	// 				console.log('new data in parent component (database landing): ', newData);
	// 				return newData;
	// 			}
	// 		}
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }
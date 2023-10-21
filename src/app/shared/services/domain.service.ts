import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DomainService {
	constructor() {}

	public domainSplitter(url: string): string {
		const urlArray = url.split('/');
    const newArray = []
		for (let string of urlArray){
      if(string === 'admin'){
        break
      }
      newArray.push(string)
    }
		console.log(newArray.join('/'));
    return newArray.join('/')
	}
}

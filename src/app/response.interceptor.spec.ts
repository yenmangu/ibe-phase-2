import { TestBed } from '@angular/core/testing';

import { DownloadFilenameInterceptor } from './response.interceptor';

describe('DownloadFilenameInterceptor', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [DownloadFilenameInterceptor]
		})
	);

	it('should be created', () => {
		const interceptor: DownloadFilenameInterceptor = TestBed.inject(
			DownloadFilenameInterceptor
		);
		expect(interceptor).toBeTruthy();
	});
});

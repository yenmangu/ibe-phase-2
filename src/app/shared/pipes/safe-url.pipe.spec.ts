import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('SafeUrlPipe', () => {
	let pipe: SafeUrlPipe;
	let sanitizer: DomSanitizer;

	beforeEach(() => {
		// Provide the DomSanitizer through TestBed
		TestBed.configureTestingModule({
			providers: [DomSanitizer]
		});

		sanitizer = TestBed.inject(DomSanitizer); // Inject the DomSanitizer
		pipe = new SafeUrlPipe(sanitizer); // Pass the sanitizer to the pipe
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});
});

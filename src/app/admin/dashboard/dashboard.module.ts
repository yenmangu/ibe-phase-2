import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { DashboardComponent } from './dashboard.component';

// Modules
import { SharedModule } from '../../shared/shared.module';

@NgModule({
	declarations: [DashboardComponent],
	imports: [CommonModule, SharedModule],
	exports: [DashboardComponent]
})
export class DashboardModule {}

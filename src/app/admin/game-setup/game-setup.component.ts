import { Component } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss']
})
export class GameSetupComponent {

  constructor(private breakpointService: BreakpointService){}

  applyMagentaGreyTheme = true;

}

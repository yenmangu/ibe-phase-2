import { create } from 'rxjs-spy';
import { tag } from 'rxjs-spy/operators';

const spy = create();

spy.log();

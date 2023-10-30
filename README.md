# Ibescore2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

app.use('/ibescore/dev', devRoute);

app.use('/ibescore/webhook', webhook);
app.use('/ibescore/auth', authRoute);
app.use('/ibescore/event', eventRoute);
app.use('/ibescore/test', createTestUsers);
app.use('/ibescore/p2p', p2pRoute);
app.use('/ibescore/deal_files', dealFiles);
app.use('/ibescore/mail', mailRoute);
app.use('/ibescore/register', newRegistrationRoute);
app.use('/ibescore/database', receivedDataRoute);
app.use('/ibescore/current_game', curentGameRoute);
app.use('/ibescore/player_database', playerDbRoute);
app.use('/ibescore/historic_games', historicGamesRoute);


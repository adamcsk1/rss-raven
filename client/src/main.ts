import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@appConfig';
import { MainComponent } from '@components/main/main.component';

bootstrapApplication(MainComponent, appConfig).catch((err) => console.error(err));

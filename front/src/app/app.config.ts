import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {fr_FR, provideNzI18n} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import fr from '@angular/common/locales/fr';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, provideHttpClient} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {graphqlProvider} from './graphql.provider';
import { provideNzConfig } from 'ng-zorro-antd/core/config';

registerLocaleData(fr);

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: LOCALE_ID, useValue: 'fr-FR' },
    provideRouter(routes),
    provideNzI18n(fr_FR),
    provideNzConfig({
      message: {
        nzDuration: 1500,
      }
    }),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    provideHttpClient(),
    graphqlProvider
  ]
};

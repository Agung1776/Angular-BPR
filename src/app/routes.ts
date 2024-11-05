import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import { FormcontohComponent } from './formcontoh/formcontoh.component';

const routeConfig: Routes = [
    {
      path: '',
      component: HomeComponent,
      title: 'Home page',
    },
    {
      path: 'contoh',
      component: FormcontohComponent,
      title: 'Contoh',
    },
  ];
  export default routeConfig;
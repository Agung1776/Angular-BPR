import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import { FormcontohComponent } from './formcontoh/formcontoh.component';
import { LoanDetailComponent } from './loan-detail/loan-detail.component';

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
    { path: 'loan-detail/:id', component: LoanDetailComponent }
  ];
  export default routeConfig;
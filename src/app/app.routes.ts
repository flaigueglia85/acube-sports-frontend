import { Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { ProductCatalogComponent } from './features/product-catalog/product-catalog.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layout/layout/layout.component';


export const routes: Routes = [
  // redirect vuoto -> home
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  // pubblica (se vuoi tenerla dietro login, aggiungi canActivate)
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], // proteggi tutto il layout
    children: [
      { path: '', component: HomeComponent },
      { path: 'prodotti', component: ProductCatalogComponent, },
      { path: 'carrello', component: CartComponent }
    ]
  },

  // auth
  { path: 'auth/login', component: LoginComponent },

  // fallback
  { path: '**', redirectTo: 'home' },
];

import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login-page.component').then((m) => m.LoginPageComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'invoices'
      },
      {
        path: 'invoices',
        loadComponent: () => import('./features/invoices/invoices-page.component').then((m) => m.InvoicesPageComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products-page.component').then((m) => m.ProductsPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

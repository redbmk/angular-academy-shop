import { Ng2StateDeclaration, UIRouter } from '@uirouter/angular';
import { ProductsComponent } from './products/products.component';
import { Injector } from '@angular/core';
import { ProductService } from './services/product.service';

export function uiRouterConfigFn(router: UIRouter, injector: Injector) {
  router.urlService.rules.otherwise({ state: 'products' });
}

export function loadProducts(transition) {
  return transition.injector().get(ProductService).dispatchLoad()
}

export const MAIN_STATES: Ng2StateDeclaration[] = [
  { name: 'products', url: '/products', component: ProductsComponent, onEnter: loadProducts },
  { name: 'profile.**', url: '/profile', loadChildren: './profile/profile.module#ProfileModule' },
  { name: 'users.**', url: '/users', loadChildren: './users/users.module#UsersModule' },
];

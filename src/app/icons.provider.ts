import { Provider } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  heroHome,
  heroShoppingBag,
  heroShoppingCart,
  heroBars3,
  heroXMark,
  heroUser,
  heroArrowRightOnRectangle
} from '@ng-icons/heroicons/outline';

export const appIconProviders: Provider[] = [
  provideIcons({
    heroHome,
    heroShoppingBag,
    heroShoppingCart,
    heroBars3,
    heroXMark,
    heroUser,
    heroArrowRightOnRectangle,
  }),
];

 import { inject } from '@angular/core';
  import { CanActivateFn, Router } from '@angular/router';
  import { AuthService } from '../services/auth';

  export const authGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    // L'utilisateur est connecté ?  il peut accéder à la route
    if (authService.isLoggedIn()) {
      return true;
    }

    // Pas connecté ? → on le redirige vers /login
    router.navigate(['/login']);
    return false;
  };

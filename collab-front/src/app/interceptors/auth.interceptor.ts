 import { HttpInterceptorFn } from '@angular/common/http';
  import { inject } from '@angular/core';
  import { AuthService } from '../services/auth';

  export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);
    const token = authService.getToken();

    // Si pas de token on envoie la requête telle quelle
    if (!token) {
      return next(req);
    }

    // On clone la requête en ajoutant le header Authorization
    const requestWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // On envoie la requête modifiée
    return next(requestWithToken);
  };

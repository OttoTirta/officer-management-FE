import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { authGuard, noAuthGuard } from './auth.guard';
import { Branch } from './components/branch/branch';
import { Position } from './components/position/position';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: 'branch',
        component: Branch,
        canActivate: [authGuard]
    },
    {
        path: 'position',
        component: Position,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: Login,
        canActivate : [noAuthGuard]
    }
];

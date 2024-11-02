// app.routes.ts
import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      //   canActivate: [AuthGuard],
      //   title: '工作台'
      // }
      // 其他需要header的页面路由配置
    ]
  },{
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
        title: '登陆'
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
        title: '注册'
      },
      // 其他不需要header的页面路由配置
    ]
  },{
    path: '**',
    component: BlankLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent),
        title: '页面未找到'
      }
    ]
  }
];
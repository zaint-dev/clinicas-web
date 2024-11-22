import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('app/main/dashboard/dashboard.module').then(mod => mod.DashboardModule),
        canActivate: [AuthGuard]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
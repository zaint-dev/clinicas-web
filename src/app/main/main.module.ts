import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MiscellaneousModule } from './pages/miscellaneous/miscellaneous.module';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MainRoutingModule,
    MiscellaneousModule,
    AuthenticationModule
  ]
})
export class MainModule { }

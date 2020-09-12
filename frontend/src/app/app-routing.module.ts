import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { CreateusersComponent } from './createusers/createusers.component';
import { EditusersComponent } from './editusers/editusers.component';


const routes: Routes = [
	{path: '', pathMatch: 'full', component: UsersComponent},
	{path: 'create', component: CreateusersComponent},
	{path: 'edit/:userId', component: EditusersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

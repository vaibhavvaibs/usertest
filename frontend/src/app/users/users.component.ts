import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
users: User[] = [];	
private usersSub: Subscription;

  constructor(public apiService: ApiService) { }

  ngOnInit(): void {
  this.apiService.getUsers();
  this.usersSub = this.apiService.getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
        console.log(this.users)
      });
  }

  onDelete(userId: string) {
    this.apiService.deleteUser(userId);
  }

	ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}

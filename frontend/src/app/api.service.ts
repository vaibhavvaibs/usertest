
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

	 private users: User[] = [];
  private usersUpdated = new Subject<User[]>();

  constructor(private http: HttpClient, private router: Router) { }


 getUsers() {
    this.http
      .get<{ message: string; users: any }>("http://localhost:3000/users")
      .pipe(
        map(userData => {
          return userData.users.map(user => {
            return {
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              phonenumber: user.phonenumber,
              image: user.image,
              id: user._id,
            };
          });
        })
      )
      .subscribe(transformedUsers => {
        this.users = transformedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUser(id: string) {
    return this.http.get<{ _id: string, firstname: string, lastname: string, email:string, phonenumber:string,  image: string }>(
      "http://localhost:3000/user/" + id
    );
  }

  addUser(firstname: string, lastname: string, email:string, phonenumber:string,  image: File) {
    console.log(firstname)
    console.log(lastname)
    console.log(email)
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("phonenumber", phonenumber);
    formData.append("image", image, firstname);
    console.log(formData)

    this.http.post<{ message: string; user: User }>("http://localhost:3000/create", formData)
      .subscribe(responseData => {
      console.log(responseData)
        const user: User = {
          id: responseData.user.id,
          firstname: firstname,
          lastname: lastname,
          email: email,
          phonenumber: phonenumber,
          image: responseData.user.image
        };
        this.users.push(user);
        this.usersUpdated.next([...this.users]);
        this.router.navigate(["/"]);
      });
  }

  updateUser(id: string, firstname: string, lastname: string, email:string, phonenumber:string, image: File | string) {
    let userData: User | FormData;
    if (typeof image === "object") {
    userData = new FormData();
    userData.append("id", id);
    userData.append("firstname", firstname);
    userData.append("lastname", lastname);
    userData.append("email", email);
    userData.append("phonenumber", phonenumber);
    userData.append("image", image, firstname);
    } else {
      userData = {
          id: id,
          firstname: firstname,
          lastname: lastname,
          email: email,
          phonenumber: phonenumber,
          image: image
      };
    }
    this.http
      .put("http://localhost:3000/user/" + id, userData)
      .subscribe(response => {
        const updatedUsers = [...this.users];
        const oldUserIndex = updatedUsers.findIndex(u => u.id === id);
        const user: User = {
          id: id,
          firstname: firstname,
          lastname: lastname,
          email: email,
          phonenumber: phonenumber,
          image: ""
        };
        updatedUsers[oldUserIndex] = user;
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
        this.router.navigate(["/"]);
      });
  }

  deleteUser(userId: string) {
    this.http
      .delete("http://localhost:3000/user/" + userId)
      .subscribe(() => {
        const updatedUsers = this.users.filter(user => user.id !== userId);
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }
  };

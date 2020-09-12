import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../user.model';

import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-editusers',
  templateUrl: './editusers.component.html',
  styleUrls: ['./editusers.component.css']
})
export class EditusersComponent implements OnInit {

	
	user: User;
	form: FormGroup;
	 private userId: string;
 imagePreview: string;
	 
  constructor(  private router: Router,   public fb: FormBuilder,   private actRoute: ActivatedRoute,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstname: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastname: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required]
      }),
       phonenumber: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required]
        
      })
    });
   this.actRoute.paramMap.subscribe((paramMap: ParamMap) => {
   console.log(paramMap)
      if (paramMap.has("userId")) {
     
        this.userId = paramMap.get("userId");
       
        console.log(this.userId)
        this.apiService.getUser(this.userId).subscribe(userData => {
          	
          this.user = {
            id: userData._id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            phonenumber: userData.phonenumber,
            image: userData.image
          };
          console.log(this.user)
          this.form.setValue({
            firstname: this.user.firstname,
            lastname: this.user.lastname,
            email: this.user.email,
            phonenumber: this.user.phonenumber,
            image: this.user.image
          });
        });
      } 
    });
   
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image");
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

   

 onEditSubmit() {
 	 this.apiService.updateUser(
 	 	this.userId,
        this.form.value.firstname,
        this.form.value.lastname,
        this.form.value.email,
        this.form.value.phonenumber,
        this.form.value.image
      );
 }
}

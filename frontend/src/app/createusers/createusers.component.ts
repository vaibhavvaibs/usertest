import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { Router } from '@angular/router';

import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-createusers',
  templateUrl: './createusers.component.html',
  styleUrls: ['./createusers.component.css']
})
export class CreateusersComponent implements OnInit {

 imagePreview: string;
    form: FormGroup; 
     submitted = false;

  constructor( public fb: FormBuilder,
    private router: Router,
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
        validators: [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]
      }),
       phonenumber: new FormControl(null, {
        validators: [ Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10), Validators.maxLength(10)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required]
        
      })
    });
  }

   get formV() { return this.form.controls; }


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

  onSubmit() {
  this.submitted = true;
     if (this.form.invalid) {
      return;
    }
      this.apiService.addUser(
        this.form.value.firstname,
        this.form.value.lastname,
        this.form.value.email,
        this.form.value.phonenumber,
        this.form.value.image
      );
  }
}

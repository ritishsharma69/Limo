import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-driver-profile',
  standalone: true,
  templateUrl: './edit-driver-profile.component.html',
  styleUrls: ['./edit-driver-profile.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonBackButton, IonButtons, IonTitle, IonContent, IonItem, IonLabel,IonButton],
})
export class EditDriverProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);

  editProfileForm!: FormGroup;
  imgData: string | null = null;
  userImage: File | null = null;

  ngOnInit() {
    this.initializeForm();
    this.loadDriverProfileData();
  }

  initializeForm() {
    this.editProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  loadDriverProfileData() {
    const driverProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    };
    this.editProfileForm.patchValue(driverProfile);
  }

  async handleTakePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
        allowEditing: false,
        correctOrientation: true,
        width: 240,
        height: 512,
      });

      if (image.webPath) {
        this.imgData = image.webPath;
        const file = await fetch(image.webPath)
          .then((res) => res.blob())
          .then((blob) => new File([blob], "photo.jpg", { type: blob.type }));
        this.userImage = file;
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  }

  async onSubmit() {
    if (this.editProfileForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.editProfileForm.get('firstName')?.value);
    formData.append('lastName', this.editProfileForm.get('lastName')?.value);
    formData.append('email', this.editProfileForm.get('email')?.value);
    formData.append('phone', this.editProfileForm.get('phone')?.value);

    if (this.userImage) {
      formData.append('image', this.userImage);
    }
    formData.forEach((value, key) => {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    });
    console.log(formData);
    

    // try {
    //   await this.apiService.updateDriverProfile(formData);
    //   this.showToast('Profile updated successfully!');
    //   this.router.navigate(['/driver-profile']);
    // } catch (error) {
    //   console.error('Error updating profile:', error);
    //   this.showToast('Error updating profile. Please try again.');
    // }
    
  }

}
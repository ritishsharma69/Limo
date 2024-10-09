import { Component, inject, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { CommonService } from 'src/app/services/common.service';
import { AlertController } from '@ionic/angular';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';

@Component({
  selector: 'app-navigate-button',
  templateUrl: './navigate-button.component.html',
  styleUrls: ['./navigate-button.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class NavigateButtonComponent implements OnInit {
  showModal = false;
  @Input() pickupAddress: string = '';
  @Input() dropoffAddress: string = '';
  waypoints = [];
  private commonService = inject(CommonService);

  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  openNavigateModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  navigateWithWaypoints() {
    let googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${this.pickupAddress}&destination=${this.dropoffAddress}&travelmode=driving`;

    if (this.waypoints && this.waypoints.length > 0) {
      const waypointsStr = this.waypoints.join('|');
      googleMapsUrl += `&waypoints=${waypointsStr}`;
    }

    // this.iab.create(googleMapsUrl, '_system');
    window.open(googleMapsUrl, '_system');
    this.closeModal();
  }

  // Navigate with live location to start point
  // navigateWithLiveLocation = async () => {
  //   try {
  //     const coordinates = await Geolocation.getCurrentPosition();
  //     const userLocation = `${coordinates.coords.latitude},${coordinates.coords.longitude}`;
  //     const waypointsWithStart = [this.pickupAddress, ...this.waypoints].join('|');

  //     console.log('User Location:', userLocation);
  //     console.log('Waypoints:', waypointsWithStart);

  //     const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation}&destination=${this.dropoffAddress}&waypoints=${waypointsWithStart}&travelmode=driving`;

  //     window.open(googleMapsUrl, '_system');
  //     this.closeModal();
  //   } catch (error) {
  //     console.error('Error getting location', error);
  //   }
  // };

  // navigateWithLiveLocation = async () => {
  //   try {
  //     const coordinates = await Geolocation.getCurrentPosition();
  //     const userLocation = `${coordinates.coords.latitude},${coordinates.coords.longitude}`;

  //     console.log('User Location:', userLocation);

  //     const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation}&destination=${this.pickupAddress}&travelmode=driving`;

  //     window.open(googleMapsUrl, '_system');
  //     this.closeModal();
  //   } catch (error) {
  //     console.error('Error getting location', error);
  //   }
  // };

  navigateWithLiveLocation = async () => {
    try {
      const permissionStatus = await Geolocation.checkPermissions();

      if (permissionStatus?.location != 'granted') {
        const requestStatus = await Geolocation.requestPermissions();

        if (requestStatus.location != 'granted') {
          this.commonService.showAlert(
            'Permission Required',
            'Location permission is needed to access your current location. Please enable it in settings.',
            [
              {
                text: 'Cancel',
                role: 'cancel',
              },
              {
                text: 'Open Settings',
                handler: () => {
                  this.openAppSettings(true);
                },
              },
            ]
          );
        }
        return;
      }

      // Now attempt to get the current position
      const coordinates = await Geolocation.getCurrentPosition();
      const userLocation = `${coordinates.coords.latitude},${coordinates.coords.longitude}`;

      console.log('User Location:', userLocation);

      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation}&destination=${this.pickupAddress}&travelmode=driving`;

      // Open Google Maps with the user’s current location and destination
      window.open(googleMapsUrl, '_system');
      this.closeModal();
    } catch (error) {
      console.error('Error getting location', error);
      this.commonService.showAlert(
        'Location Error',
        'Please ensure that GPS is enabled on your device. Try again later.'
      );
    }
  };

  // Method to open app settings
  async openAppSettings(app = false) {
    return NativeSettings.open({
      optionAndroid: app
        ? AndroidSettings.ApplicationDetails
        : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices,
    });
  }
}

import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  async requestLocationPermissions(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('Location permissions are not applicable on web');
      return;
    }
  
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Current permission status:', permissionStatus);
  
      if (permissionStatus.location === 'granted') {
        console.log('Location permission already granted.');
        return;
      }
  
      const { location } = await Geolocation.requestPermissions();
      console.log('Requested permission status:', location);
  
      if (location !== 'granted') {
        console.error('Location permission denied');
        throw new Error('Location permission denied');
      } else {
        console.log('Location permission granted.');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      throw error;
    }
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('Location fetching is not applicable on web');
      return Promise.resolve({ latitude: 0, longitude: 0 });
    }

    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location', error);
      return Promise.reject(error);
    }
  }
}

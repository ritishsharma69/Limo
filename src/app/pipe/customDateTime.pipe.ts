import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
 
@Pipe({
  name: 'customDateTime',
  standalone: true,
})
export class CustomDateTimePipe implements PipeTransform {
 
  constructor(private datePipe: DatePipe) {}
 
  transform(date: string, time: string): string | null {

    // Ensure both date and time are provided
    if (!date || !time) return null;
 
    // Combine date and time into a single Date object
    const combinedDateTime = new Date(`${date}T${time}`);
 
    // Check if the resulting date is valid
    if (isNaN(combinedDateTime.getTime())) return null;
 
    // Format the combined Date object using Angular's DatePipe
    return this.datePipe.transform(combinedDateTime, 'dd MMM, h:mm a');
  }
}
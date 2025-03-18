import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'windDirection'
})
export class WindDirectionPipe implements PipeTransform {
  transform(degrees: number): string {
    if (degrees == null || isNaN(degrees)) return 'Невідомо';

    if (degrees >= 338 || degrees < 23) return 'N <i class="pi pi-arrow-up"></i>';
    if (degrees >= 23 && degrees < 68) return 'NE <i class="pi pi-arrow-up-right"></i>';
    if (degrees >= 68 && degrees < 113) return 'E <i class="pi pi-arrow-right"></i>';
    if (degrees >= 113 && degrees < 158) return 'SE <i class="pi pi-arrow-down-right"></i>';
    if (degrees >= 158 && degrees < 203) return 'S <i class="pi pi-arrow-down"></i>';
    if (degrees >= 203 && degrees < 248) return 'SW <i class="pi pi-arrow-down-left"></i>';
    if (degrees >= 248 && degrees < 293) return 'W <i class="pi pi-arrow-left"></i>';
    return 'NW <i class="pi pi-arrow-up-left"></i>';
  }
}

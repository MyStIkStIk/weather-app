import {Component, inject} from '@angular/core';
import {WeatherApiService} from '../../services/WeatherApi.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {environment} from '../../environment/environment';
import {WindDirectionPipe} from '../../pipes/WindDirection.pipe';

@Component({
  selector: 'app-weather-info',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    WindDirectionPipe
  ],
  templateUrl: './weather-info.component.html',
  styleUrl: './weather-info.component.scss'
})
export class WeatherInfoComponent {
  protected readonly weatherApiService = inject(WeatherApiService);
  protected readonly environment = environment;
}

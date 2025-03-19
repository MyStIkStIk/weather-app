import {Component, inject} from '@angular/core';
import {WeatherApiService} from './shared/services/WeatherApi.service';
import {AutoCompleteComponent} from './shared/components/auto-complete/auto-complete.component';
import {WeatherInfoComponent} from './shared/components/weather-info/weather-info.component';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    AutoCompleteComponent,
    WeatherInfoComponent,
    Toast
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly weatherApiService = inject(WeatherApiService);

  searchMethod = (text: string) => {
    return this.weatherApiService.getCity(text);
  };

  getWeatherInfo(city: string) {
    this.weatherApiService.getWeather(city);
  }
}

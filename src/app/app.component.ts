import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {WeatherApiService} from './shared/services/WeatherApi.service';
import {AutoCompleteComponent} from './shared/components/auto-complete/auto-complete.component';
import {WeatherInfoComponent} from './shared/components/weather-info/weather-info.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    AutoCompleteComponent,
    WeatherInfoComponent
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected readonly weatherApiService = inject(WeatherApiService);
  private readonly $destroy = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  weatherClass = '';

  searchMethod = (text: string) => {
    return this.weatherApiService.getCity(text);
  };

  ngOnInit() {
    this.weatherApiService.$weatherInfo.pipe(
      takeUntilDestroyed(this.$destroy)
    ).subscribe((weatherInfo) => {
      this.weatherClass = weatherInfo?.general.toLowerCase() || '';
      this.cdr.markForCheck();
    });
  }

  getWeatherInfo(city: string) {
    this.weatherApiService.getWeather(city);
  }
}

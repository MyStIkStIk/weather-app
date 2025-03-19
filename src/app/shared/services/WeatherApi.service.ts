import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment/environment';
import {map, Observable, take, tap} from 'rxjs';
import {OtherInfoModel, TemperatureModel, WeatherModel, WindModel} from '../models/WeatherModel';
import {MessageService} from 'primeng/api';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class WeatherApiService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);

  private cache = new Map<string, { timestamp: number; data: WeatherModel }>();
  private cacheDuration = 10 * 60 * 1000;

  weatherInfo: WritableSignal<WeatherModel | null> = signal(null);
  weatherType: WritableSignal<string> = signal('');

  getCity(text: string): Observable<{ key: string; value: string }[]> {
    return this.http.get<any[]>(
      `${environment.weatherApiGeoUrl}?q=${text}&limit=10&appid=${environment.weatherApiKey}`
    ).pipe(
      map(response => response.map((city: any) => (
            {
              key: city.name, value: city.name + ', ' + city.country
            }
          )
        )
      )
    );
  }

  getWeather(city: string) {
    const cacheEntry = this.cache.get(city);
    const now = Date.now();

    if (cacheEntry && now - cacheEntry.timestamp < this.cacheDuration) {
      this.setWeatherInfo(cacheEntry.data);
      return;
    }

    this.http.get(`${environment.weatherApiUrl}?q=${city}&appid=${environment.weatherApiKey}&units=metric`)
      .pipe(
        map((response: any) => {
          return {
            city: response.name,
            description: response.weather[0].description,
            icon: response.weather[0].icon,
            general: response.weather[0].main,
            otherInfo: {
              pressure: response.main.pressure,
              humidity: response.main.humidity,
              visibility: response.visibility
            } as OtherInfoModel,
            temperature: {
              temp: response.main.temp,
              feels: response.main.feels_like,
              min: response.main.temp_min,
              max: response.main.temp_max
            } as TemperatureModel,
            wind: {
              speed: response.wind.speed,
              deg: response.wind.deg,
              gust: response.wind.gust
            } as WindModel
          } as WeatherModel;
        }),
        tap((data: WeatherModel) => {
          this.cache.set(city, {timestamp: now, data: data});
        }),
        take(1)
      ).subscribe(
      data => this.setWeatherInfo(data),
      error => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message});
      }
    );
  }

  setWeatherInfo(weatherInfo: WeatherModel) {
    this.weatherInfo.set(weatherInfo);
    this.weatherType.set(weatherInfo.general.toLowerCase());
  }
}

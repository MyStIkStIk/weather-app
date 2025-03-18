import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environment/environment';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {KeyValue} from '@angular/common';
import {OtherInfoModel, TemperatureModel, WeatherModel, WindModel} from '../models/WeatherModel';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class WeatherApiService {
  private readonly http = inject(HttpClient);

  private cache = new Map<string, { timestamp: number; data: WeatherModel }>();
  private cacheDuration = 10 * 60 * 1000;

  weatherInfo!: WeatherModel;
  weatherInfo$ = new BehaviorSubject(this.weatherInfo);
  $weatherInfo = this.weatherInfo$.asObservable();

  getCity(text: string): Observable<KeyValue<string, string>[]> {
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
        })
      ).subscribe(
      data => this.setWeatherInfo(data),
      error => console.error('Помилка запиту:', error)
    );
  }

  setWeatherInfo(weatherInfo: WeatherModel) {
    this.weatherInfo = weatherInfo;
    this.weatherInfo$.next(this.weatherInfo);
  }
}

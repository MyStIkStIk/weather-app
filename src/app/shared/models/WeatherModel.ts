import {WeatherTypes} from '../enums/WeatherTypes';

export interface WeatherModel {
  city: string;
  icon: string;
  general: WeatherTypes;
  otherInfo: OtherInfoModel;
  temperature: TemperatureModel;
  wind: WindModel;
}

export interface OtherInfoModel {
  pressure: number;
  humidity: number;
  visibility: number;
}

export interface TemperatureModel {
  temp: number;
  feels: number;
  min: number;
  max: number;
}

export interface WindModel {
  speed: number;
  deg: number;
  gust: number;
}

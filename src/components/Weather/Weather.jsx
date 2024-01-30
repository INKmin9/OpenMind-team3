import { useEffect, useState } from 'react';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { positionOptions } from '../../utils/positionOptions';
import { getWeatherData } from '../../api/api';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import * as S from './WeatherStyle';

export default function Weather() {
  const { location, error } = useCurrentLocation(positionOptions);
  const [weather, setWeather] = useState('');
  const [city, setCity] = useState('');
  const [temp, setTemp] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      if (error) {
        return console.log('Geolocation error:', error);
      }
      // geolocation에서 error를 받아왔을 경우 error 출력
      // 사용자 위치 값을 받아왔을 경우 아래의 날씨 data 받아오기 실행
      if (location) {
        try {
          // 날씨 데이터 불러오기
          const weatherData = await getWeatherData(
            location.latitude,
            location.longitude,
          );

          // 불러온 날씨 데이터로 city, weather, temp 설정
          if (weatherData) {
            setCity(weatherData.name);
            setTemp(`${weatherData.main.temp}°C`);
            setWeather({
              icon: weatherData.weather[0].icon,
              weather: weatherData.weather[0].description,
            }); // 그냥 weather를 요청하면 날씨를 글자로 보내주고 icon을 붙이면 날씨에 맞는 이미지 url을 보내준다.
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    fetchWeather();
  }, [location, error]);

  return (
    <S.WeatherContainer>
      {!weather === false ? (
        <S.WeatherTracker>
          <p>{city}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
            alt="날씨 이미지"
          />
          <p>{temp}</p>
          <p>{weather.weather}</p>
        </S.WeatherTracker>
      ) : (
        <LoadingSpinner error={error} />
      )}
    </S.WeatherContainer>
  );
}
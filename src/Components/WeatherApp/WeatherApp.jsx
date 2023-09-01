import React, { useState, useEffect } from 'react'
import './WeatherApp.css'

import search_icon from '../Assets/search.png'
import clear_icon from '../Assets/clear.png'
import drizzle_icon from '../Assets/drizzle.png'
import humidity_icon from '../Assets/humidity.png'
import snow_icon from '../Assets/snow.png'
import wind_icon from '../Assets/wind.png'
import rain_icon from '../Assets/rain.png'
import cloud_icon from '../Assets/cloud.png'
import error_icon from '../Assets/error.png'

const WeatherApp = () => {

    let api_key = "f1c903a922afa965532499a8171a3417";
    const minRequestInterval = 1000; // Minimum time interval (in milliseconds) between API requests
     

    const [weathericon, setWeathericon] = useState(clear_icon);
    const [stscode, setStscode] = useState(200);
    const [temperature, setTemperature] = useState(null);
    const [location, setLocation] = useState('');
    const [humidity, setHumidity] = useState(null);
    const [windSpeed, setWindSpeed] = useState(null);
    const [lastRequestTime, setLastRequestTime] = useState(0);
    const [loading, setLoading] = useState(false);

    const search = async () => {

        const currentTime = Date.now();

        if (currentTime - lastRequestTime < minRequestInterval) {
            console.log('Rate limit exceeded. Please wait before making another request.');
            return;
        }

        setLoading(true);



        try {
            const city = document.getElementsByClassName("cityInput")[0].value;
            const cacheKey = `weather_${city}`;

            // Check if data is cached
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const { weather, temp, name, humidity, speed } = JSON.parse(cachedData);
                setWeathericon(weather);
                setTemperature(temp);
                setLocation(name);
                setHumidity(humidity);
                setWindSpeed(speed);
                setLoading(false);
            } else {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${api_key}`;
                const response = await fetch(url);
                const data = await response.json();
                setStscode(data.cod);

                if (data.cod === 200) {
                    const { weather, main, wind, name } = data;
                    setWeathericon(getWeatherIcon(weather[0].icon));
                    setTemperature(main.temp);
                    setLocation(name);
                    setHumidity(main.humidity);
                    setWindSpeed(wind.speed);

                    // Cache the data
                    const cachedData = {
                        weather: getWeatherIcon(weather[0].icon),
                        temp: main.temp,
                        name,
                        humidity: main.humidity,
                        speed: wind.speed,
                    };
                    localStorage.setItem(cacheKey, JSON.stringify(cachedData));
                } else {
                    // Handle errors here (e.g., display an error message)
                    console.error('API Error:', data.message);
                }

                setLoading(false);
                setLastRequestTime(currentTime);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setLoading(false);
        }
    };


    const getWeatherIcon = (iconCode) => {
        if (iconCode === "01d" || iconCode === "01n") return clear_icon;
        if (iconCode === "02d" || iconCode === "02n") return cloud_icon;
        if (iconCode === "03d" || iconCode === "03n") return drizzle_icon;
        if (iconCode === "04d" || iconCode === "04n") return cloud_icon; 
        if (iconCode === "09d" || iconCode === "09n") return rain_icon;
        if (iconCode === "10d" || iconCode === "10n") return rain_icon;
        if (iconCode === "13d" || iconCode === "13n") return snow_icon;
        return clear_icon; // Default icon if no mapping found
    };

    return (
        <div className='container'>
            <div className='top-bar'>
                <input type="text" className="cityInput" placeholder='search city' />
                <div className="search-icon" onClick={search}>
                    <img src={search_icon} alt="search icon" />
                </div>
            </div>

            {loading ? (
                <div className='weather-location'>
                    Loading...
                </div>
            ) :

                stscode === 200 ? (
                    <>
                        <div className='weather-image'>
                            <img src={weathericon} alt="Weather Icon" />
                        </div>
                        <div className="weather-temp" >
                            {temperature}
                        </div>
                        <div className="weather-location">{location}</div>
                        <div className="data-container">
                            <div className="element">
                                <img src={humidity_icon} alt="Humidity Icon" className='icon' />
                                <div className='data'>
                                    <div className='humidity-percent'>{humidity}%</div>
                                    <div className='text'>Humidity</div>
                                </div>
                            </div>
                            <div className="element">
                                <img src={wind_icon} alt="Wind Icon" className='icon' />
                                <div className='data'>
                                    <div className='wind-speed'>{windSpeed} km/h</div>
                                    <div className='text'>Wind Speed</div>
                                </div>
                            </div>
                        </div>

                    </>
                ) : (
                    <div className='error-container'>
                        <div className='error-icon' >
                            <img src={error_icon} width={200} height={200} alt="Error Icon" />
                        </div>
                        <div className="weather-location" >City Not Found. Please check again.</div>
                    </div>
                )
            }
        </div >);


}


export default WeatherApp
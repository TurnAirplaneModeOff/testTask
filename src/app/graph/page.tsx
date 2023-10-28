'use client'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ReactECharts } from './ReactEchart'
import { ReactEChartsProps } from './ReactEchart';

interface WeatherData {
    dt: string,
    sunrise: string,
    sunset: string,
    temp: {
        day: number,
        min: number,
        max: number,
        night: number,
        eve: number,
        morn: number,
    },
    feels_like: {
        day: number,
        night: number,
        eve: number,
        morn: number
    },
    pressure: number,
    humidity: number,
    weather: [{
        id: number,
        main: string,
        description: string,
        icon: string
    }],
    speed: number,
    deg: number,
    gust: number,
    clouds: number,
    pop: number,
    rain: number,
}
interface responceForm {
    city: any,
    cnt: number,
    cod: string
    list: WeatherData[],
    message: number
}

export default function Page() {
    const searchParams = useSearchParams()

    const name = searchParams.get('name')


    const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  
    async function getWeatherForecast(city: string): Promise<void> {
        const numb: number = 7;
        try {
            const response = await axios.request<responceForm>({
                method: 'GET',
                url: `https://api.openweathermap.org/data/2.5/forecast/daily?q=${name}&cnt=${7}&units=metric&mode=json&appid=c8d5b1517def51c5101652e515512484`,
            });

            if (response.data) {
                

                setWeatherData(response.data.list);

            } else {

                setWeatherData(null);
            }
        } catch (error) {

            setWeatherData(null);
        }
    }

    let option: ReactEChartsProps["option"] | null = null;
    
    let optionDifferentWind: ReactEChartsProps["option"] | null = null;
    let optionDifferentHumidity: ReactEChartsProps["option"] | null = null;

    useEffect(() => {
        if (name) {

            getWeatherForecast(name as string);
        }

    }, [name]);
    let feelsLike: number[][]
    if (weatherData !== null) {
        feelsLike = weatherData.map((elem) => {
            return Object.values(elem.feels_like);
        })

        option = {
            title: {
                text: 'Temperature feels today'
            },
            tooltip: {
                trigger: 'axis'
            },
           
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
           
                data: ['Morning', 'Day', 'Evening', 'Night']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: dataConvert(weatherData[0].dt),
                    type: 'line',
                    stack: 'Total',
                    data: feelsLike[0]
                },
                {
                    name: dataConvert(weatherData[1].dt),
                    type: 'line',
                    stack: 'Total',
                    data: feelsLike[1]
                },
                {
                    name: dataConvert(weatherData[2].dt),
                    type: 'line',
                    stack: 'Total',
                    data: feelsLike[2]
                },
                {
                    name: dataConvert(weatherData[3].dt),
                    type: 'line',
                    stack: 'Total',
                    data: feelsLike[3]
                },
                {
                    name: dataConvert(weatherData[4].dt),
                    type: 'line',
                    stack: 'Total',
                    data: feelsLike[4]
                },
                
                {
                    name: dataConvert(weatherData[5].dt),
                    type: 'line',
                    stack: 'Total',
                    data: feelsLike[5]
                },
                
                {
                    name: dataConvert(weatherData[6].dt),
                    type: 'line',
                    stack: 'Total',
                    data: feelsLike[6]
                }
            ]
        }
        optionDifferentWind={
            title: {
                text: 'Wind speed'
            },
            xAxis: {
              type: 'category',
              data: [
                               dataConvert(weatherData[0].dt), 
               dataConvert(weatherData[1].dt), 
               dataConvert(weatherData[2].dt),
               dataConvert(weatherData[3].dt), 
               dataConvert(weatherData[4].dt), 
               dataConvert(weatherData[5].dt),
               dataConvert(weatherData[6].dt)]
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: 
                [weatherData[0].speed,
                weatherData[1].speed,
                weatherData[2].speed,
                weatherData[3].speed,
                weatherData[4].speed,
                weatherData[5].speed,
                weatherData[6].speed
            ],
                type: 'bar'
              }
            ]
          };
          optionDifferentHumidity = {
            title: {
              text: 'Weather different humidity',
           
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: 'Humidity',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: weatherData[0].humidity, name:  dataConvert(weatherData[0].dt)+ "%" },
                  { value: weatherData[1].humidity, name:  dataConvert(weatherData[1].dt)+ "%", },
                  { value: weatherData[2].humidity, name:  dataConvert(weatherData[2].dt)+ "%",},
                  { value: weatherData[3].humidity, name:  dataConvert(weatherData[3].dt)+ "%", },
                  { value: weatherData[4].humidity, name:  dataConvert(weatherData[4].dt)+ "%", },
                  { value: weatherData[5].humidity, name:  dataConvert(weatherData[5].dt)+ "%", },
                  { value: weatherData[6].humidity, name:  dataConvert(weatherData[6].dt)+ "%", }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
    
        }

    return (
        <div className='flex flex-col justify-center items-center'>
            <h2 className='text-2xl'>The charts of weather for {name}</h2>


            {option && <ReactECharts style={{ height: "500px" }} option={option} />}
            {optionDifferentWind && <ReactECharts style={{ height: "500px" }} option={optionDifferentWind} />}
            {optionDifferentHumidity && <ReactECharts style={{ height: "500px" }} option={optionDifferentHumidity} />}


        </div>
    )

}

function dataConvert(dt: string) {
    if (dt === undefined) return ""

    const date = new Date(Number(dt) * 1000);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}`;
}

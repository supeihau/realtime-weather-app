import React, { useState, useEffect, useMemo } from 'react'
import styled from '@emotion/styled';
import { ReactComponent as DayThunderstorm } from './images/day-thunderstorm.svg';
import { ReactComponent as DayClear } from './images/day-clear.svg';
import { ReactComponent as DayCloudyFog } from './images/day-cloudy-fog.svg';
import { ReactComponent as DayCloudy } from './images/day-cloudy.svg';
import { ReactComponent as DayFog } from './images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './images/day-snowing.svg';
import { ReactComponent as NightThunderstorm } from './images/night-thunderstorm.svg';
import { ReactComponent as NightClear } from './images/night-clear.svg';
import { ReactComponent as NightCloudyFog } from './images/night-cloudy-fog.svg';
import { ReactComponent as NightCloudy } from './images/night-cloudy.svg';
import { ReactComponent as NightFog } from './images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './images/night-snowing.svg';

// 透過 styled(組件) 來把樣式帶入已存在的組件(圖片.svg)中
const IconContainer = styled.div`
  /* 在這裡寫入 CSS 樣式 */
  flex-basis: 30%;
  svg{
    max-height: 160px;
  }
`;

const weatherTypes = {
    isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
    isClear: [1],
    isCloudyFog: [25, 26, 27, 28],
    isCloudy: [2, 3, 4, 5, 6, 7],
    isFog: [24],
    isPartiallyClearWithRain: [
      8, 9, 10, 11, 12,
      13, 14, 19, 20, 29, 30,
      31, 32, 38, 39,
    ],
    isSnowing: [23, 37, 42],
};

const weatherIcons = {
    day: {
      isThunderstorm: <DayThunderstorm />,
      isClear: <DayClear />,
      isCloudyFog: <DayCloudyFog />,
      isCloudy: <DayCloudy />,
      isFog: <DayFog />,
      isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
      isSnowing: <DaySnowing />,
    },
    night: {
      isThunderstorm: <NightThunderstorm />,
      isClear: <NightClear />,
      isCloudyFog: <NightCloudyFog />,
      isCloudy: <NightCloudy />,
      isFog: <NightFog />,
      isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
      isSnowing: <NightSnowing />,
    },
};

const weatherCode2Type = (weatherCode) => {
  const [weatherType] =
    Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
      weatherCodes.includes(Number(weatherCode))
    ) || [];
  // 使用 Object.entries 將 weatherTypes 這個物件的 key 和 value 轉成陣列，把 key 取做 weatherType，把 value 取做 weatherCodes
  // 針對該陣列使用 find 方法來跑迴圈，搭配 includes 方法來檢驗 API 回傳的「天氣代碼」，會對應到哪一種「天氣型態」
  // 找到的陣列會長像這樣 ['isClear', [1]]，因此可以透過透過陣列的賦值，取出陣列的第一個元素，並取名為 weatherType 後回傳  
  return weatherType; //isClear
};

// 使用解構賦值將所需的資料從 props 取出 weatherCode, moment
const WeatherIcon = ({ currentWeatherCode, moment}) => {
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState('isClear')
  
   //透過 useMemo 保存計算結果(isClear)，記得要在 dependencies 中放入 currentWeatherCode
  const theWeatherIcon = useMemo(() => 
    weatherCode2Type(currentWeatherCode), [currentWeatherCode]); //當API回傳的weatherCode改變是會使用useMemo

   // 在 useEffect 中去改變 currentWeatherIcon，記得定義 dependencies
  useEffect(() => {
    setCurrentWeatherIcon(theWeatherIcon);
  }, [theWeatherIcon]);
    // 一旦它有改變，useEffect 內的函式就會再次被呼叫到，進而呼叫到 setCurrentWeatherIcon 並觸發畫面重新渲染。
  
  return (
    <IconContainer>
      {/* 從 weatherIcons 中找出對應的圖示， [night][isClear]*/}
      {weatherIcons[moment][currentWeatherIcon]} 
    </IconContainer>
  )
}

export default WeatherIcon;

//WeatherCode -> weatherType -> weatherIcons
//     1           isClear      weatherIcon.day(.night).isClear: <DayClear />
//API回傳取得的
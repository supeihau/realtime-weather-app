import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';


import sunriseAndSunsetData from './sunrise-sunset.json';
import WeatherCard from './WeatherCard.js';
import useWeatherApi from './useWeatherApi.js';
import WeatherSetting from './WeatherSetting.js';
import { findLocation } from './utils';

import { ThemeProvider } from '@emotion/react';

const Container = styled.div`
  /* 在 Styled Component 中可以透過 Props 取得對的顏色 */
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

//以太陽落下時間判斷現在是day or night ，傳回白天或是夜晚的天氣圖
const getMoment = (locationName) => {
  console.log('getMoment')
  //從data裡面找出符合的地區，先抓該地區的data縮小範圍
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  )

  //如果找不到回傳null
  if (!location) return null;

  //取得當前日期
  const now = new Date();
  // 將當前日期以 xxxx-xx-xx 的格式呈現
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');

  // 從剛剛縮小的地區data(location)中找到 time.dataTime = 當前日期，
  // 抓該日期的data縮小範圍
  const locationDate = location.time && location.time.find(
    (time) => time.dataTime === nowDate)

  //從剛剛縮小的日期data(locationDate)中找出日期和時間，轉成時間戳記
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimestamp = now.getTime();
  // console.log('sunrise', sunriseTimestamp);
  // console.log('sunset', sunsetTimestamp);
  // console.log('now', nowTimestamp);

  return (
    sunriseTimestamp <= nowTimestamp && nowTimestamp <= sunsetTimestamp ?
      'day' : 'night'
  );
};

const WeatherApp = () => {
  // 即使使用者重新整理瀏覽器，會從 localStorage 去取得使用者上次設定的資料。
  //localStorage 將使用者設定地區保存下來，從localStorage取出cityName
  const storageCity = localStorage.getItem('cityName');  //讀取特定資料
  
  // 定義要拉取天氣資訊的地區
  // 若storageCity存在則作為currentCity的預設值，否則使用臺北市
  const [currentCity, setCurrentCity] = useState(storageCity || '臺北市');
  // 根據currentCity 在findLocation方法中找到對應地區的資料
  // a為假，拿後面b(空物件)
  const currentLocation = findLocation(currentCity) || {}
  // 回傳{
  //   cityName: '澎湖縣',
  //   locationName: '澎湖',
  //   sunriseCityName: '澎湖',
  // }

  //把currentLocation當成參數傳入useWeatherApi中
  const [WeatherElement, fetchData] = useWeatherApi(currentLocation);

  const [currentTheme, setCurrentTheme] = useState('light');

  //判斷更換頁面(WeatherCard or WeatherSetting)
  const [currentPage, setCurrentPage] = useState('WeatherCard');

  //透過 useMemo 避免每次都須重新計算取值，呼叫 getMoment 方法取得回傳值，並且帶入 dependencies
  const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), //臺北
    [currentLocation.sunriseCityName]); //moment 回傳'day' or 'night'

  //根據moment決定使用顏色主題
  useEffect(() => {
    console.log('useEffect moment');
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment]);

  // 當currentCity有改變時，儲存到localStorage中
  useEffect(() =>{
    localStorage.setItem('cityName', currentCity) //儲存資料
  }, [currentCity]);

  return (
    // 把所有會用到主題配色的部分都包在 ThemeProvider 內
    // 透過 theme 這個 props 傳入深色主題
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* 如果a為真，拿後面b */}
        {currentPage === 'WeatherCard' && (
          //props 傳入weatherCard裡取用
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={WeatherElement}
            moment={moment}
            fetchData={fetchData}
            // 把setCurrentPage從WeatherApp傳送到WeatherCard
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'WeatherSeeting' && (
          <WeatherSetting
            // 把縣市名稱傳入 WeatherSetting 中當作表單「地區」欄位的預設值
            cityName={currentLocation.cityName}
            // 把 setCurrentCity 傳入，讓 WeatherSetting 可以修改 currentCity
            setCurrentCity={setCurrentCity}
            // 把setCurrentPage從WeatherApp傳送到WeatherSetting
            setCurrentPage={setCurrentPage}
          />
        )}

      </Container>
    </ThemeProvider>
  )
};

export default WeatherApp;


//一開始網頁載入時，畫面一共會渲染三次，isLoading 的狀態分別是 true （預設值）-> true （拉資料前）-> false（拉完資料後）
// 當使用者點選更新按鈕後，畫面會渲染兩次，isLoading 的狀態分別是 true（拉資料前） -> false（拉完資料後）

//useCallback 共用fetchdata方法時，把function保留下來，為避免進入迴圈不斷重新渲染
//useMemo 把某個運算的結果保留下來
//當按重整按紐時，isLoading 紀錄資料回傳了嗎，決定Refresh的Icon

//第一次畫面渲染
// useEffect fetchData -> fetchData -> fetchingData -> fetchCurrentWeather -> fetchWeatherForecast 
// -> useEffect moment -> getMoment
//按重新整理的渲染
{/* <Refresh onClick={fetchData} isLoading={isLoading}>
fetchData -> fetchingData -> fetchCurrentWeather -> fetchWeatherForecast API取得不同的資料 */}
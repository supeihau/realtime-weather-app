import { useState, useEffect, useCallback} from 'react';

// 取得時間 地點 溫度 風速 濕度的API資料
const fetchCurrentWeather = (locationName) => {
    console.log('fetchCurrentWeather');
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-E5F961C1-F220-4AFF-9FA4-5652A1E0B4B2&limit=5&locationName=${locationName}`)  // 向 requestURL 發送請求
        .then((response) => response.json()) // 取得伺服器回傳的資料並以 JSON 解析
        .then((data) => {
            const locationData = data.records.location[0];

            const weatherElements = locationData.weatherElement.reduce(
                (neededElements, item) => {
                    if (['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
                        neededElements[item.elementName] = item.elementValue;
                    }
                    return neededElements;
                },
                {}
            )

            return {
                observationTime: locationData.time.obsTime, //2022-08-26 23:00:00
                locationName: locationData.locationName + '市', //臺北市
                temperature: weatherElements.TEMP,
                windSpeed: weatherElements.WDSD,
                humid: weatherElements.HUMD,
            };
        });
};

// 取得描述 weatherCode 下雨機率 舒適度的API資料
const fetchWeatherForecast = (cityName) => {
    console.log('fetchWeatherForecast');
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-E5F961C1-F220-4AFF-9FA4-5652A1E0B4B2&limit=5&locationName=${cityName}`)                  // 向 requestURL 發送請求
        .then((response) => response.json())
        .then((data) => {
            const locationData = data.records.location[0];
            const weatherElements = locationData.weatherElement.reduce(
                (neededElements, item) => {
                    if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
                        neededElements[item.elementName] = item.time[0].parameter;
                    }
                    return neededElements;
                },
                {}
            );
            return {
                description: weatherElements.Wx.parameterName, //多雲午後短暫雷陣雨
                weatherCode: weatherElements.Wx.parameterValue, //22
                rainPossibility: weatherElements.PoP.parameterName, //30
                comfortability: weatherElements.CI.parameterName, //悶熱至易中暑
            }
        });
};

// 把useState, useCallback, useEffect 放進來
// 讓useWeatherApi接收從WeatherApp傳來的參數currentLocation(cityName, locationName, sunriseCityName)
const useWeatherApi = (currentLocation) => {
    //用解構賦值取出
    const {locationName, cityName} = currentLocation; 

    //用useState 定義會使用到的資料狀態
    const [WeatherElement, setWeatherElement] = useState({
        observationTime: new Date(),
        locationName: '',
        humid: 0,
        temperature: 0,
        windSpeed: 0,
        description: '',
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: '',
        isLoading: true, //載入中的提示
    });

    //等兩個API資料都回傳後才呼叫setWeatherElement重新渲染畫面
    const fetchData = useCallback(() => {
        console.log('fetchData');
        const fetchingData = async () => {
            console.log('fetchingData');
            // 兩個API取得的資料使用陣列的解構賦值把資料取出
            const [currentWeather, weatherForecast] = await Promise.all([
                // locationName:"臺北" 給 觀測 天氣拉取API用的地區名
                fetchCurrentWeather(locationName),
                // locationName:"臺北市" 給 預測 天氣拉取
                fetchWeatherForecast(cityName),
            ]);
            // 把取得的資料透過物件的解構賦值放入setWeatherElement中
            setWeatherElement({
                ...currentWeather,
                ...weatherForecast,
                isLoading: false, //資料載入完成
            });
        };

        // 只需要帶入函式就可以取得原本的資料狀態，再透過物件的解構賦值把原有資料帶進去，
        // 更新 isLoading 的狀態改成 true
        setWeatherElement((prevState) => ({
            ...prevState,
            isLoading: true,
        }));

        fetchingData();
    }, [locationName, cityName]); //第一次渲染，在整個 useEffect()中沒有相依於任何 React 內的資料狀態（state 或 props），因此在 useEffect 第二個參數的 dependencies 陣列中仍然可以留空就好

    // 只要weatherApp回傳的locationCityName/ cityName改變，
    // fetchData就會執行，就會改變
    // fetchData改變，就會執行useEffect，拉取最新天氣資料
    useEffect(() => {
        // 呼叫 fetchData 這個方法，按重整按鈕
        console.log('useEffect fetchData');
        fetchData();
    }, [fetchData]); //fetchData 改變時才會執行useEffect，避免進入迴圈

    return [WeatherElement, fetchData];
}

export default useWeatherApi
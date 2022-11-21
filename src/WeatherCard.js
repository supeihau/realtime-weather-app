import React from 'react'
import styled from '@emotion/styled'; 

//載入svg圖片
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RedoIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg'
import { ReactComponent as CogIcon } from './images/cog.svg'
import { ReactComponent as SearchIcon } from './images/search.svg'
import WeatherIcon from './WeatherIcon.js';


// 現在每個在 <ThemeProvider> 中所定義的 Styled Components 都可以透過 props 取得色彩
const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 430px;
  box-shadow:  ${({ theme }) => theme.boxShadow};
  background-color:  ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
  background-image: url("https://i.imgur.com/0pA0NG3.png");
  background-repeat: no-repeat;
  background-position: left top, right bottom, center center;
`;

const Location = styled.div`
  font-size: 28px;
  color:  ${({ theme }) => theme.titleColor};
  margin-bottom: 15px;
  display: flex;
  justify-content:center;
`;

const Icon = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  filter: drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.2));
`;

const Box = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
`;

const Temperature = styled.div`
  color:  ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
  justify-content: center;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
  text-align: center;
`;

const AirFlow = styled.div`
  display: block;
  justify-content: center;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color:  ${({ theme }) => theme.textColor};

  svg {
    width: 30px;
    height: auto;
    margin-right: 20px;
    margin-left: 20px;
  }
`;

const WindSpeed = styled.div`
  display: block;
  font-size: 20px;
  margin-top: 10px;
  text-align: center;
`;

const Rain = styled.div`
  display: block;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color:  ${({ theme }) => theme.textColor};

  svg {
    width: 30px;
    height: auto;
    margin-right: 20px;
    margin-left: 20px;
  }
`;

const RainPossibility = styled.div`
  display: block;
  font-size: 20px;
  margin-top: 10px;
  text-align: center;
`;

const Refresh = styled.div`
  display: flex;
  justify-content:center;
  font-size: 20px;
  color:  ${({ theme }) => theme.textColor};

  svg {
    margin-top: 8px;
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    /* 使用 rotate 動畫效果在 svg 圖示上 */
    animation: rotate infinite 1.5s linear;

    // 取得傳入的props並根據它來決定動畫要不要執行
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }

  /* 定義旋轉的動畫效果，並取名為 rotate */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  left: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const Search = styled(SearchIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const WeatherCard = (props) => {
  // 解構賦值從props取出傳入的資料
  const {  cityName, weatherElement, moment, fetchData, setCurrentPage } = props;
  //取出放入JSX使用
  const {
    observationTime,
    // locationName,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement;

  return (
    <WeatherCardWrapper>
      {/* 當齒輪被點擊的時候，將CurrentPage改成WeatherSeeting */}
      <Search onClick={() => setCurrentPage('WeatherSetting')} />
      <Cog onClick={() => setCurrentPage('ThemeSetting')}/>
      <Location>{cityName}</Location>
      <Refresh onClick={fetchData} isLoading={isLoading}>
        {new Intl.DateTimeFormat('zh-TW', {
          hour: 'numeric',
          minute: 'numeric',
        }).format(new Date(observationTime))}{' '}
        {/* 當 isLoading 的時候顯示 LoadingIcon 否則顯示 RedoIcon */}
        {isLoading ? <LoadingIcon /> : <RedoIcon />}
      </Refresh>
      <Icon>
        <WeatherIcon
          currentWeatherCode={weatherCode}
          moment={moment || 'night'}  // 如果a為真，就用a /如果a為假，就用b
        />
      </Icon>

      <Box>
        <AirFlow>
          <AirFlowIcon />
          <WindSpeed>
            {windSpeed} m/h
          </WindSpeed>
        </AirFlow>

        <Temperature>
          {Math.round(temperature)}
          <Celsius>°</Celsius>
        </Temperature>

        <Rain>
          <RainIcon />
          <RainPossibility>
            {Math.round(rainPossibility)} %
          </RainPossibility>
        </Rain>
      </Box>

    </WeatherCardWrapper>
  )
}

export default WeatherCard
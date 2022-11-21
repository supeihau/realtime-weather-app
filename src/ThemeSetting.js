import React, { useState } from 'react';
import styled from '@emotion/styled';
import { availableLocations } from './utils';

const ThemeSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.settingColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

const theme = ['dark', 'light'];

const ThemeSetting = (props) => {
    const {color, setCurrentPage, setCurrentTheme } = props;

    // 抓使用者輸入哪個顏色
    const [themeColor, setThemeColor] = useState(color);

    const hanleChange = (e) => {
        console.log(e.target.value);
        setThemeColor(e.target.value);
        // value值有改變的時候，setThemeColor做更改 
    }

    const handleSave = () => {
        if(theme.includes(themeColor)){
            console.log(`顏色:${themeColor}`);
            setCurrentTheme(themeColor); 
            //按下儲存後抓取themeColor的值，使用setCurrentTheme回傳更改WeatherCard的顏色
            setCurrentPage('WeatherCard');
            //並跳回WeatherCard的頁面
        }
        else{
            alert(`儲存失敗`);
            return;
        }
    }

    return (
        <ThemeSettingWrapper>
            <Title>主題</Title>

            <StyledLabel htmlFor='theme'>顏色</StyledLabel>
            <StyledInputList
                list='theme-list'
                id='theme'
                name='theme'
                onChange={hanleChange}
                value={themeColor} //抓選單的value值
            />
            {/* html datalist */}
            <datalist id='theme-list'>
                {/* 顯示地區option */}
                {theme.map(theme => (
                    <option value={theme} key={theme} />
                ))}
            </datalist>

            <ButtonGroup>
                <Back onClick={() => setCurrentPage('WeatherCard')}>返回</Back>
                <Save onClick={handleSave}>儲存</Save>
            </ButtonGroup>
        </ThemeSettingWrapper>
    )
};

export default ThemeSetting;
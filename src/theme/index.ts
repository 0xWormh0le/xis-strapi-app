import { theme as chakraTheme } from '@chakra-ui/core'

// TODO: update theme with correct typings from chakra when available
const makeTheme = <T extends any>(chakraTheme: T) => {
  return {
    ...chakraTheme,
    fonts: {
      body: 'PT Sans, Helvetica Neue, sans-serif'
    },
    colors: {
      ...chakraTheme.colors,
      brand: {
        50: '#d8ffff',
        100: '#acfbff',
        200: '#7df7ff',
        300: '#4df4ff',
        400: '#27f1fe',
        500: '#00a8b3',
        600: '#00a8b3',
        700: '#007881',
        800: '#00494e',
        900: '#001a1d'
      },
      primary: {
        50: '#d8ffff',
        100: '#acfbff',
        200: '#7df7ff',
        300: '#4df4ff',
        400: '#27f1fe',
        500: '#00a8b3',
        600: '#00a8b3',
        700: '#007881',
        800: '#00494e',
        900: '#001a1d'
      },
      error: {
        50: '#ffe6e4',
        100: '#fcbab8',
        200: '#f48e8a',
        300: '#ee625d',
        400: '#e93630',
        500: '#cf1d16',
        600: '#a21511',
        700: '#750d0b',
        800: '#470604',
        900: '#1e0000'
      },
      success: {
        50: '#e3fbee',
        100: '#c3ebd7',
        200: '#a0dcbf',
        300: '#7ccda7',
        400: '#59bf8e',
        500: '#40a674',
        600: '#30815a',
        700: '#205c40',
        800: '#0e3825',
        900: '#001509'
      },
      neutral: {
        lightest: '#F9F9FB',
        light: '#f0f1f3',
        base: '#404041',
        dark: '#222429'
      },
      border: {
        default: '#E4E7EB',
        muted: '#EDF0F2'
      },
      text: {
        muted: '#66788A',
        default: '#425A70',
        dark: '#222429'
      },
      intent: {
        success: '#47B881',
        danger: '#EC4C47',
        warning: '#D9822B',
        info: '#5AC1F2'
      },
      background: {
        tint1: '#F9F9FB',
        tint2: '#F5F6F7'
      },
      solid: {
        black: '#000',
        white: '#FFF',
        lightGray: '#C2C2C2'
      },
      opacity: {
        transparent: 'transparent',
        transparentBlack: 'rgba(0,0,0,0.1)',
        transparentWhite: 'rgba(255,255,255,0.5)'
      }
    },
    transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    gridGutter: 1 // rem - taken from Chakra UI space scale https://chakra-ui.com/theme#spacing
  }
}

const theme = makeTheme(chakraTheme)

export { theme }
export { default as images } from './images'

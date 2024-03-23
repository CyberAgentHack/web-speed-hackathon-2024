import { Palette } from './palette';

export const Color = {
  Alert: Palette.RED_50,
  Background: Palette.GRAY_90,
  Favorite: Palette.PINK_50,
  Info: Palette.CYAN_50,
  MONO_0: Palette.GRAY_0,
  MONO_10: Palette.GRAY_10,
  MONO_20: Palette.GRAY_20,
  MONO_30: Palette.GRAY_30,

  MONO_40: Palette.GRAY_40,
  MONO_50: Palette.GRAY_50,
  MONO_60: Palette.GRAY_60,
  MONO_70: Palette.GRAY_70,
  MONO_80: Palette.GRAY_80,
  MONO_90: Palette.GRAY_90,
  MONO_100: Palette.GRAY_100,
  MONO_A: Palette.WHITE_0,
  outlineBackground: Palette.GRAY_20,
  Primary: Palette.YELLOW_20,
  Secondary: Palette.YELLOW_50,
  SubFavorite: Palette.PINK_30,

  Success: Palette.GREEN_50,
  Warning: Palette.ORANGE_50,
} as const;
export type Color = (typeof Color)[keyof typeof Color];

const TextSize = {
  10: '0.625rem',
  12: '0.75rem',
  14: '0.875rem',
  16: '1rem',
  20: '1.25rem',
  24: '1.5rem',
  32: '2rem',
  40: '2.5rem',
} as const;
type TextSize = (typeof TextSize)[keyof typeof TextSize];

const TextHeight = {
  COMFORT: '1.8',
  DENSE: '1.2',
  NORMAL: '1.5',
} as const;
type TextHeight = (typeof TextHeight)[keyof typeof TextHeight];

export const Typography = {
  NORMAL12: `font-size: ${TextSize[12]}; letter-spacing: 0; line-height: ${TextHeight.NORMAL};`,
  NORMAL14: `font-size: ${TextSize[14]}; letter-spacing: 0; line-height: ${TextHeight.NORMAL};`,
  NORMAL16: `font-size: ${TextSize[16]}; letter-spacing: 0; line-height: ${TextHeight.NORMAL};`,
  NORMAL20: `font-size: ${TextSize[20]}; letter-spacing: 0; line-height: ${TextHeight.NORMAL};`,
  NORMAL24: `font-size: ${TextSize[24]}; letter-spacing: 0; line-height: ${TextHeight.NORMAL};`,
  NORMAL32: `font-size: ${TextSize[32]}; letter-spacing: 0; line-height: ${TextHeight.NORMAL};`,
} as const;
export type Typography = (typeof Typography)[keyof typeof Typography];

export const Radius = {
  LARGE: '16px',
  MEDIUM: '12px',
  SMALL: '8px',
  X_LARGE: '24px',
} as const;
export type Radius = (typeof Radius)[keyof typeof Radius];

export const BreakPoint = {
  MOBILE: 1024,
} as const;
export type BreakPoint = (typeof BreakPoint)[keyof typeof BreakPoint];

export const Space = 8 as const;

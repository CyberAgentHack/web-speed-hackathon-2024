export const Palette = {
  CYAN_50: '#14B5C2',
  GRAY_0: '#F7F7F7',
  GRAY_10: '#EFEFEF',
  GRAY_20: '#E7E7E7',
  GRAY_30: '#D3D3D3',
  GRAY_40: '#C0C0C0',
  GRAY_50: '#A6A6A6',
  GRAY_60: '#8D8D8D',
  GRAY_70: '#787878',
  GRAY_80: '#5C5C5C',

  GRAY_90: '#404040',

  GRAY_100: '#202020',

  GREEN_50: '#14C288',

  ORANGE_50: '#E26908',

  PINK_30: '#FEEAF3',
  PINK_50: '#F76685',

  RED_50: '#E21C2F',
  WHITE_0: '#FFFFFF',
  YELLOW_0: '#FFDD33',
  YELLOW_5: '#FFF3C4',
  YELLOW_10: '#FCE588',
  YELLOW_20: '#FADB5F',
  YELLOW_30: '#F7C948',
  YELLOW_40: '#F0B429',
  YELLOW_50: '#DE911D',
  YELLOW_60: '#CB6E17',
  YELLOW_70: '#B44D12',
  YELLOW_80: '#FFDD33',
} as const;
export type Palette = (typeof Palette)[keyof typeof Palette];

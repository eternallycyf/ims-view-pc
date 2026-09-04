/** Ant Design Tag 预设色，与 CustomTag 保持一致 */
export const CUSTOM_TAG_COLOR_PRESETS = [
  'magenta',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'red',
] as const;

export type CustomTagColorPreset = (typeof CUSTOM_TAG_COLOR_PRESETS)[number];

export interface CustomTagColorStyle {
  preset: CustomTagColorPreset;
  text: string;
  bg: string;
  border: string;
}

/** 各预设色对应的文字色与浅色背景，供卡片等场景复用 */
const CUSTOM_TAG_COLOR_STYLES: Record<CustomTagColorPreset, Omit<CustomTagColorStyle, 'preset'>> = {
  magenta: { text: '#c41d7f', bg: '#fff0f6', border: '#ffadd2' },
  volcano: { text: '#d4380d', bg: '#fff2e8', border: '#ffbb96' },
  orange: { text: '#d46b08', bg: '#fff7e6', border: '#ffd591' },
  gold: { text: '#d48806', bg: '#fffbe6', border: '#ffe58f' },
  lime: { text: '#7cb305', bg: '#fcffe6', border: '#eaff8f' },
  green: { text: '#389e0d', bg: '#f6ffed', border: '#b7eb8f' },
  cyan: { text: '#08979c', bg: '#e6fffb', border: '#87e8de' },
  blue: { text: '#0958d9', bg: '#e6f4ff', border: '#91caff' },
  geekblue: { text: '#1d39c4', bg: '#f0f5ff', border: '#adc6ff' },
  purple: { text: '#531dab', bg: '#f9f0ff', border: '#d3adf7' },
  red: { text: '#cf1322', bg: '#fff1f0', border: '#ffa39e' },
};

/** 根据文本长度从预设色中稳定取色 */
export function getRandomTagColorByText(text: string): CustomTagColorPreset {
  const index = text.length % CUSTOM_TAG_COLOR_PRESETS.length;
  return CUSTOM_TAG_COLOR_PRESETS[index];
}

/** 根据预设色名获取文字色与背景色 */
export function getTagColorStyle(preset: string): CustomTagColorStyle {
  const colorPreset = (CUSTOM_TAG_COLOR_PRESETS as readonly string[]).includes(preset)
    ? (preset as CustomTagColorPreset)
    : 'blue';
  return {
    preset: colorPreset,
    ...CUSTOM_TAG_COLOR_STYLES[colorPreset],
  };
}

/** 根据文本直接获取配色（文字色 + 背景色） */
export function getTagColorStyleByText(text: string): CustomTagColorStyle {
  return getTagColorStyle(getRandomTagColorByText(text));
}

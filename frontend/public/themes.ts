export const THEMES: { [themeName: string]: Theme } = {
  brown: {
    light: '#f0dab5',
    dark: '#b58763',
  },
  classic: {
    light: '#fff',
    dark: '#707070',
  },
};

interface Theme {
  light: string;
  dark: string;
}

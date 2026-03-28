export interface FontEntry {
  name: string;
  value: string;
}

export interface FontGroup {
  label: string;
  fonts: FontEntry[];
}

export const FONT_GROUPS: FontGroup[] = [
  {
    label: 'Serif',
    fonts: [
      { name: 'Playfair Display', value: 'Playfair Display' },
      { name: 'Lora', value: 'Lora' },
      { name: 'Cormorant Garamond', value: 'Cormorant Garamond' },
      { name: 'Libre Baskerville', value: 'Libre Baskerville' },
      { name: 'Merriweather', value: 'Merriweather' },
      { name: 'EB Garamond', value: 'EB Garamond' },
      { name: 'Crimson Text', value: 'Crimson Text' },
      { name: 'DM Serif Display', value: 'DM Serif Display' },
    ],
  },
  {
    label: 'Sans-serif',
    fonts: [
      { name: 'Inter', value: 'Inter' },
      { name: 'Lato', value: 'Lato' },
      { name: 'Montserrat', value: 'Montserrat' },
      { name: 'Open Sans', value: 'Open Sans' },
      { name: 'Raleway', value: 'Raleway' },
      { name: 'Nunito', value: 'Nunito' },
      { name: 'Josefin Sans', value: 'Josefin Sans' },
    ],
  },
  {
    label: 'Display',
    fonts: [
      { name: 'Oswald', value: 'Oswald' },
      { name: 'Bebas Neue', value: 'Bebas Neue' },
      { name: 'Abril Fatface', value: 'Abril Fatface' },
    ],
  },
];

export const ALL_FONTS = FONT_GROUPS.flatMap((g) => g.fonts);

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      'brand': {
        'primary': '#2623E8',
        'secondary': '#E5E823'
      },
      'theme': {
        'success': '#6AA628',
        'warning': '#F2B702',
        'danger': '#EA0000',
        'info': '#4589D6'
      }
    }
  },
  shortcuts: [
    {
      "btn-link": "underline hover:text-blue-500 transition"
    },
    [/^btn-icon-([0-9\.]*)([a-z]*)?$/, ([,s,u]) => `w-${s}${u} h-${s}${u} rounded-full flex justify-center items-center`]
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle'
      }
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives()
  ]
  // transformers: [
  //   transformerDirectives(),
  //   transformerVariantGroup(),
  // ],
})

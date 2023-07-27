/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          purple1: '#ae92fe',
          purple2: '#b365ff',
          purple3: '#6839bf',
          purple4: '#874cff',
          purple5: '#4613b3',
          purple6: '#6619ff',
        },
        greyscale: {
          g1: '#F8F8F8',
          g2: '#F3F3F3',
          g3: '#F0F1F4',
          g4: '#CCD0D9',
          g5: '#AAB2BD',
          g6: '#434A54',
        }
      }
    },
  },
  plugins: [],
}


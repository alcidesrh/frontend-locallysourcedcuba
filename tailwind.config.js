// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,vue,ts}'],
  purge: ['./src/**/*.{html,js,vue,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },

  prefix: 'tw-',

  variants: {},
  plugins: [],
};

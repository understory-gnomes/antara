module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
        'gate': "url('/gate.jpg')",
       })
    },
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      logo: ['Libre Baskerville', 'serif']
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

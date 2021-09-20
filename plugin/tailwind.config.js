module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    colors: {
      black: '#000000',
      'black 8': '#000000',
      'black 3': '#000000',
      white: '#ffffff',
      'white 8': '#ffffff',
      'white 4': '#ffffff',
      blue: '#18a0fb',
      purple: '#907cff',
      'hot pink': '#f531b3',
      green: '#1bc47d',
      red: '#f24822',
      yellow: '#ffeb00',
      'special ': {
        ' selection a': '#daebf7',
        ' selection b': '#edf5fa',
        ' black 1': '#000000',
        ' hover fill': '#000000',
        ' blue 3': '#1891fb',
        ' purple 4': '#7b61ff',
        ' white 2': '#ffffff',
      },
      'background ': {
        ' white': '#ffffff',
        ' grey f0': '#f0f0f0',
        ' silver': '#e5e5e5',
        ' black': '#000000',
        ' hud': '#222222',
        ' toolbar': '#2c2c2c',
      },
      'multiplayer ': {
        ' y': '#ffc700',
        ' g': '#1bc47d',
        ' r': '#ef5533',
        ' b': '#18a0fb',
        ' p': '#907cff',
        ' t': '#00b5ce',
        ' s': '#ee46d3',
      },
      '.doc ': {
        ' redline a': '#ff2e00',
        ' redline b': '#0075ff',
        ' redline c': '#0abf73',
      },
    },
    fontSize: {
      ui11: ['11px', { lineHeight: '16px', letterSpacing: '0.005em' }],
      ui12: ['12px', { lineHeight: '16px', letterSpacing: '0em' }],
      ui13: ['13px', { lineHeight: '24px', letterSpacing: '-0.0025em' }],
      ui14: ['14px', { lineHeight: '24px', letterSpacing: '-0.006em' }],
      ui15: ['15px', { lineHeight: '24px', letterSpacing: '-0.009em' }],
      ui15: ['15px', { lineHeight: '24px', letterSpacing: '-0.009em' }],
      ui16: ['16px', { lineHeight: '24px', letterSpacing: '-0.011em' }],
      ui17: ['17px', { lineHeight: '24px', letterSpacing: '-0.013em' }],
      ui18: ['18px', { lineHeight: '24px', letterSpacing: '-0.014em' }],
      ui19: ['19px', { lineHeight: '32px', letterSpacing: '-0.016em' }],
      ui20: ['20px', { lineHeight: '32px', letterSpacing: '-0.017em' }],
      ui24: ['24px', { lineHeight: '32px', letterSpacing: '-0.019em' }],
      ui30: ['30px', { lineHeight: '40px', letterSpacing: '-0.021em' }],
      ui40: ['40px', { lineHeight: '56px', letterSpacing: '-0.022em' }],
      ui42: ['42px', { lineHeight: '56px', letterSpacing: '-0.022em' }],
      ui48: ['48px', { lineHeight: '64px', letterSpacing: '-0.022em' }],
      ui60: ['60px', { lineHeight: '80px', letterSpacing: '-0.022em' }],
    },
    boxShadow: {
      'HUD shadow':
        '0px 5px 17px 0px rgba(0,0,0,0.2), 0px 2px 7px 0px rgba(0,0,0,0.15)',
      'Cursor shadow': '0px 1px 3px 0px rgba(0,0,0,0.35)',
      'Modal shadow': '0px 2px 14px 0px rgba(0,0,0,0.15)',
    },
    extend: {
      borderRadius: {
        3: '3px',
      },
      gridTemplateColumns: {
        components: 'repeat(28,8px)',
      },
      gridColumn: {
        'span-28': 'span 28 / span 28',
        'span-27': 'span 27 / span 27',
        'span-26': 'span 26 / span 26',
        'span-25': 'span 25 / span 25',
        'span-24': 'span 24 / span 24',
        'span-23': 'span 23 / span 23',
        'span-22': 'span 22 / span 22',
        'span-21': 'span 21 / span 21',
        'span-20': 'span 20 / span 20',
        'span-19': 'span 19 / span 19',
        'span-18': 'span 18 / span 18',
        'span-17': 'span 17 / span 17',
        'span-16': 'span 16 / span 16',
        'span-15': 'span 15 / span 15',
        'span-14': 'span 14 / span 14',
        'span-13': 'span 13 / span 13',
      },
      gridColumnStart: {
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
        24: '24',
        25: '25',
        26: '26',
        27: '27',
        28: '28',
        29: '29',
      },
      gridColumnEnd: {
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
        24: '24',
        25: '25',
        26: '26',
        27: '27',
        28: '28',
        29: '29',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

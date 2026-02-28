// State definitions for Karen LED system
export const builtInStates = ['QUIET', 'TALKING', 'YELLING', 'RAINBOW', 'OFF'];

export const characters = [
  {
    name: 'Cinderella',
    states: [
      { name: 'TALKING_TO_CINDERELLA', base: 'TALKING', r: 100, g: 200, b: 255, brightness: 80, color: '#64C8FF' }, // Icy Blue
      { name: 'YELLING_AT_CINDERELLA', base: 'YELLING', r: 255, g: 0, b: 50, brightness: 150, color: '#FF0032' },
      { name: 'LISTENING_TO_CINDERELLA', base: 'QUIET', r: 0, g: 50, b: 100, brightness: 40, color: '#003264' }
    ]
  },
  {
    name: 'Snow White',
    states: [
      { name: 'TALKING_TO_SNOW_WHITE', base: 'TALKING', r: 255, g: 215, b: 0, brightness: 80, color: '#FFD700' }, // Gold/Yellow
      { name: 'YELLING_AT_SNOW_WHITE', base: 'YELLING', r: 255, g: 0, b: 0, brightness: 150, color: '#FF0000' },
      { name: 'LISTENING_TO_SNOW_WHITE', base: 'QUIET', r: 60, g: 40, b: 0, brightness: 40, color: '#3C2800' }
    ]
  },
  {
    name: 'Sleeping Beauty',
    states: [
      { name: 'TALKING_TO_SLEEPING', base: 'TALKING', r: 255, g: 20, b: 147, brightness: 80, color: '#FF1493' }, // Pink
      { name: 'YELLING_AT_SLEEPING', base: 'YELLING', r: 200, g: 0, b: 255, brightness: 150, color: '#C800FF' },
      { name: 'LISTENING_TO_SLEEPING', base: 'QUIET', r: 50, g: 0, b: 60, brightness: 40, color: '#32003C' }
    ]
  },
  {
    name: 'Rapunzel',
    states: [
      { name: 'TALKING_TO_RAPUNZEL', base: 'TALKING', r: 173, g: 255, b: 47, brightness: 80, color: '#ADFF2F' }, // Green/Gold
      { name: 'YELLING_AT_RAPUNZEL', base: 'YELLING', r: 255, g: 140, b: 0, brightness: 150, color: '#FF8C00' },
      { name: 'LISTENING_TO_RAPUNZEL', base: 'QUIET', r: 40, g: 60, b: 0, brightness: 40, color: '#283C00' }
    ]
  },
  {
    name: 'Belle',
    states: [
      { name: 'TALKING_TO_BELLE', base: 'TALKING', r: 255, g: 255, b: 0, brightness: 80, color: '#FFFF00' }, // Bright Yellow
      { name: 'YELLING_AT_BELLE', base: 'YELLING', r: 255, g: 69, b: 0, brightness: 150, color: '#FF4500' },
      { name: 'LISTENING_TO_BELLE', base: 'QUIET', r: 75, g: 75, b: 0, brightness: 40, color: '#4B4B00' }
    ]
  },
  {
    name: 'Little Mermaid',
    states: [
      { name: 'TALKING_TO_MERMAID', base: 'TALKING', r: 127, g: 255, b: 212, brightness: 80, color: '#7FFFD4' }, // Aquamarine
      { name: 'YELLING_AT_MERMAID', base: 'YELLING', r: 0, g: 0, b: 139, brightness: 150, color: '#00008B' },
      { name: 'LISTENING_TO_MERMAID', base: 'QUIET', r: 0, g: 75, b: 75, brightness: 40, color: '#004B4B' }
    ]
  },
  {
    name: 'O.F.G.',
    states: [
      { name: 'TALKING_TO_OFG', base: 'TALKING', r: 200, g: 255, b: 255, brightness: 80, color: '#C8FFFF' }, // Magic White/Cyan
      { name: 'YELLING_AT_OFG', base: 'YELLING', r: 255, g: 255, b: 255, brightness: 200, color: '#FFFFFF' },
      { name: 'LISTENING_TO_OFG', base: 'QUIET', r: 60, g: 60, b: 80, brightness: 40, color: '#3C3C50' }
    ]
  },
  {
    name: 'Narrator',
    states: [
      { name: 'TALKING_GENERAL_RED', base: 'TALKING', r: 255, g: 0, b: 0, brightness: 100, color: '#FF0000' }, // Script Cue: Red Intercom
      { name: 'SYSTEM_OFF', base: 'QUIET', r: 0, g: 0, b: 0, brightness: 0, color: '#000000' }
    ]
  }
];

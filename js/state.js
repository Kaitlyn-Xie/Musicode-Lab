// ════════════════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════════════════
const VARS = [
  { id:'v1', name:'variable1', color:'#A8D8F0', dark:'#1860A0', notes:['E4','G4','A4','G4','E4'] },
  { id:'v2', name:'variable2', color:'#A8F0C8', dark:'#186840', notes:['C4','E4','G4','E4','C4'] },
  { id:'v3', name:'variable3', color:'#F0D0A8', dark:'#885020', notes:['G4','A4','B4','A4','G4'] },
  { id:'v4', name:'variable4', color:'#E0A8F0', dark:'#682088', notes:['D4','F4','A4','F4','D4'] },
  { id:'v5', name:'variable5', color:'#F0A8B8', dark:'#881840', notes:['C4','D4','E4','F4','G4'] },
];
const CUSTOM_COLORS = ['#20A880','#E03060','#8080D0','#D08020','#20A0D0','#D04040'];
let customVars = [];
let customVarCounter = 0;
function allVars() { return [...VARS, ...customVars]; }

let canvas = [];
let mode = 'free';
let instrument = 'piano';
let tempo = 116;
let running = false;
let stopFlag = false;
let toneReady = false;
let uidCtr = 1;
let dragPayload = null;
let activeCat = 'variables';
let activeContainer = null;
let score = 0;
let tutStep = 0;
let readIdx = 0;
let listenIdx = 0;

const NOTES_LIST = ['C2','D2','E2','F2','G2','A2','B2','C3','D3','E3','F3','G3','A3','B3',
  'C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','clap','rest'];

const LEVELS = [
  {
    id: 1,
    icon: 'algorithm',
    title: 'Algorithms & Sequencing',
    desc: 'Sort musical notes into the right order, then code it with blocks and Python.',
    tag: 'CT: Sequencing',
    tagColor: '#1860A0', tagBg: '#E3F0FF',
    color: '#2E80D0',
    phases: ['Intro Activity','Block Code','Python'],
  },
  {
    id: 2,
    icon: 'variable',
    title: 'Variables & Music Phrases',
    desc: 'Store four Birthday phrases as variables and arrange them into a complete song.',
    tag: 'Coding: Variables',
    tagColor: '#186858', tagBg: '#E3FBF5',
    color: '#20A880',
    phases: ['Meet the phrases','Build the song','How Computers Think'],
  },
  {
    id: 3,
    icon: 'loop',
    title: 'Loops & Frère Jacques',
    desc: 'Each phrase repeats twice — that\'s a loop! Use repeat blocks to build Frère Jacques.',
    tag: 'Coding: Loops',
    tagColor: '#885800', tagBg: '#FFF8E1',
    color: '#D4A020',
    phases: ['Meet the phrases','Build with loops','How Computers Think'],
  },
  {
    id: 4,
    icon: 'binary',
    title: 'Binary Music',
    desc: 'Clap = 1, Rest = 0. Decode a binary rhythm and encode your own!',
    tag: 'CT: Binary',
    tagColor: '#186840', tagBg: '#E3FFE8',
    color: '#2EA870',
    phases: ['What is binary?','Decode the beat','Encode your own'],
  },
  {
    id: 5,
    icon: 'debug',
    title: 'Debug the Music',
    desc: 'Something sounds wrong. Read the code, find the bug, and fix it.',
    tag: 'CT: Debugging',
    tagColor: '#882000', tagBg: '#FFE8E3',
    color: '#D04040',
    phases: ['Reading code','Spot the bug','Fix & test'],
  },
  {
    id: 6,
    icon: 'search',
    title: 'Search & Sort',
    desc: 'Find the highest note in a melody, then sort a scrambled sequence.',
    tag: 'CT: Algorithms',
    tagColor: '#885020', tagBg: '#FFF3E0',
    color: '#E07830',
    phases: ['Linear search','Bubble sort','Efficiency'],
  },
  {
    id: 7,
    icon: 'compose',
    title: 'Create Your Song',
    desc: 'Use everything you\'ve learned — variables, loops, and more — to compose your own piece.',
    tag: 'Create',
    tagColor: '#681888', tagBg: '#F5E8FF',
    color: '#9030D0',
    phases: ['Plan your song','Build & refine','Share'],
  },
];

const endOfWeek = require('date-fns/endOfWeek');
const setDate = require('date-fns/set');

function dueAtSunday() {
  const time5pm = { hours: 17, minutes: 0, seconds: 0, milliseconds: 0 };
  return endOfWeek(setDate(new Date(), time5pm), { weekStartsOn: 1 });
}

module.exports = [
  {
    type: 'list',
    id: '7aa1809e-c7cf-4e36-869f-d10615055b1d',
    title: 'Shopping list',
    createdAt: new Date('2023-12-17T18:00:00.000Z'),
  },
  {
    type: 'task',
    listId: '7aa1809e-c7cf-4e36-869f-d10615055b1d',
    id: 'cd47856c-49da-4de5-9d3c-c1b50183a6e6',
    title: 'Tomato soup',
    dueAt: dueAtSunday(),
    createdAt: new Date('2023-12-17T18:01:00.000Z'),
  },
  {
    type: 'task',
    listId: '7aa1809e-c7cf-4e36-869f-d10615055b1d',
    id: 'ae9ec0a5-ab1b-4450-913b-e8bf1eedef74',
    title: 'Sourdough bread',
    createdAt: new Date('2023-12-17T18:02:00.000Z'),
  },
  {
    type: 'task',
    listId: '7aa1809e-c7cf-4e36-869f-d10615055b1d',
    id: '75813664-607a-4365-b2ff-ccef04681467',
    title: 'Breaded Chicken Steaks 4 Pack',
    createdAt: new Date('2023-12-17T18:03:00.000Z'),
  },
  {
    type: 'task',
    listId: '7aa1809e-c7cf-4e36-869f-d10615055b1d',
    id: '13b6eb22-0158-41f7-92d6-0507990162ad',
    title: 'Steamed Rice',
    createdAt: new Date('2023-12-17T18:04:00.000Z'),
  },
  {
    type: 'task',
    listId: '7aa1809e-c7cf-4e36-869f-d10615055b1d',
    id: 'a90ff947-ff28-49b1-a5d3-acc210e86eb8',
    title: 'Katsu Curry Sauce',
    createdAt: new Date('2023-12-17T18:05:00.000Z'),
  },

  {
    type: 'list',
    id: '41a040a1-4235-494c-ae52-e699a1760810',
    title: 'WFH improvements list',
    createdAt: new Date('2023-12-17T19:00:00.000Z'),
  },
  {
    type: 'task',
    listId: '41a040a1-4235-494c-ae52-e699a1760810',
    id: 'dc5bc748-556e-4a7e-811b-1d4d31de67a7',
    title: '2x 24" monitor',
    url: 'https://www.amazon.co.uk/Lenovo-D24-40-Inch-Monitor-1080p/dp/B0C4FSN88X/ref=sr_1_1_sspa',
    createdAt: new Date('2023-12-17T19:01:00.000Z'),
  },
  {
    type: 'task',
    listId: '41a040a1-4235-494c-ae52-e699a1760810',
    id: 'f3747f62-2fc6-4b44-8d31-97f4f7f2bdaa',
    title: 'Macbook vertical laptop stand',
    url: 'https://www.amazon.co.uk/UGREEN-Vertical-laptop-stand-holder/dp/B091B4SWR7/ref=sr_1_2_sspa',
    createdAt: new Date('2023-12-17T19:02:00.000Z'),
  },
  {
    type: 'task',
    listId: '41a040a1-4235-494c-ae52-e699a1760810',
    id: '37e623b5-090f-421f-963e-9d13b35d2f7a',
    title: 'Keyboard & mouse',
    url: 'https://www.amazon.co.uk/Apple-Wireless-Keyboard-A1644-Magic-White/dp/B085D8QHGC/ref=sr_1_9',
    createdAt: new Date('2023-12-17T19:03:00.000Z'),
  },
];

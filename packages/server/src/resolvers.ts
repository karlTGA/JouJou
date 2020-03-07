const dummyData = [
  {
    title: 'TestTitle',
    date: '2020-03-07T11:31:21.799Z',
    isPublic: true,
    content:
      '{"blocks":[{"key":"68iu4","text":"Heute war ein schoener Tag.","type":"unstyled","depth":0,"inlineStyleRanges": [],"entityRanges":[],"data":{}}],"entityMap":{}}'
  }
];

export default {
  Query: {
    entries: () => dummyData
  }
};

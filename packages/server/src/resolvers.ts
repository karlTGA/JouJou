const dummyData = [
  {
    id: 'id' + new Date().getTime(),
    title: 'TestTitle',
    date: '2020-03-07T11:31:21.799Z',
    isPublic: true,
    location: 'Berlin',
    content:
      '{"blocks":[{"key":"68iu4","text":"Heute war ein schoener Tag.","type":"unstyled","depth":0,"inlineStyleRanges": [],"entityRanges":[],"data":{}}],"entityMap":{}}'
  }
];

export default {
  Query: {
    getEntries: () => dummyData
  },
  Mutation: {
    updateEntry: (id: string | null, newEntry: any) => {
      if (id == null) {
        newEntry.id = 'id' + new Date().getTime();
        dummyData.push(newEntry);
        return newEntry;
      }

      const entrieIndex = dummyData.findIndex(entry => entry.id === id);
      dummyData[entrieIndex] = newEntry;
      return newEntry;
    }
  }
};

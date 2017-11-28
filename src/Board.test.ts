import Board from './Board';

const sampleCsvFiles = {

  topLeft: `X,X,X,X,X,X,X,X,X,X,X,X,X,X
X,X,X,X,X,X,X,X,X,X,X,X,X,X
X,X,.,.,.,.,.,.,.,.,.,.,X,X
X,X,.,X,X,X,X,X,X,X,.,.,X,X
X,X,.,X,X,X,X,X,X,X,.,.,X,X
X,X,.,X,X,X,X,X,X,X,.,.,.,.
X,X,.,.,.,.,.,.,.,.,.,.,X,X
X,X,.,X,X,.,X,X,.,X,X,.,X,X
X,X,O,X,X,.,X,X,.,X,O,.,X,X
X,X,X,X,X,.,X,X,.,.,.,X,X,X
X,X,X,X,X,.,X,X,X,X,X,X,X,X`,

  topRight: `X,X,X,X,X,X,X,X,X,X,X,X,X,X
X,.,.,.,.,.,.,.,.,.,.,.,O,X
X,.,X,.,.,X,X,.,X,X,X,X,.,X
X,.,X,X,.,X,X,.,X,,,X,.,X
X,.,.,X,.,X,X,.,X,X,X,X,.,X
.,.,.,.,.,.,.,.,.,.,.,.,.,X
X,.,X,X,.,X,X,X,.,X,X,X,X,X
X,.,X,X,.,X,X,X,.,X,,,,
X,.,X,X,.,.,.,.,.,X,,,,
X,O,X,X,X,X,X,X,.,X,,,,
X,X,X,,,,,X,.,X,,,,`,

  centerLeft: `,,,,X,.,X,X,X,X,X,,,X
,,,,X,.,X,X,X,X,X,,,X
,,,,X,.,X,X,,,,,,
,,,,X,.,X,X,,,X,X,X,
X,X,X,X,X,.,X,X,,,X,,,
X,,,,,.,,,,,X,,,
X,X,X,X,X,.,X,X,,,X,,,
,,,,X,.,X,X,,,X,X,X,X
,,,,X,.,X,X,,,,,,
,,,,X,.,X,X,,X,X,X,X,X
,,,,X,.,X,X,,X,X,X,X,X`,

  centerRight: `X,,,X,X,X,X,X,.,X,,,,
X,,,X,X,X,X,X,.,X,,,,
,,,,,,X,X,.,X,,,,
,X,X,X,,,X,X,.,X,,,,
,,,X,,,X,X,.,X,X,X,X,X
,,,X,,,,,.,,,,,X
,,,X,,,X,X,.,X,X,X,X,X
X,X,X,X,,,X,X,.,X,,,,
,,,,,,X,X,.,X,,,,
X,X,X,X,X,,X,X,.,X,,,,
X,X,X,X,X,,X,X,.,X,,,,`,

  bottomLeft: `X,X,X,X,X,.,X,X,X,X,X,X,X,X
X,.,.,.,.,.,.,.,.,.,.,.,.,X
X,.,X,X,X,.,X,X,X,X,X,X,.,X
X,.,X,.,.,.,.,.,.,.,O,X,.,X
X,.,X,.,X,X,X,X,X,X,.,X,.,X
X,.,.,.,X,X,,,X,X,.,.,.,.
X,.,X,.,X,X,X,X,X,X,.,X,.,X
X,.,X,.,.,.,.,.,.,.,.,X,.,X
X,.,X,X,X,X,X,X,.,X,X,X,.,X
X,O,.,.,.,.,.,.,.,.,.,.,.,X
X,X,X,X,X,X,X,X,X,X,X,X,X,X`,

  bottomRight: `X,X,X,X,X,X,X,X,.,X,X,X,X,X
X,.,.,.,.,.,.,.,.,.,.,.,.,X
X,.,X,X,.,X,X,X,X,X,X,X,.,X
X,.,X,O,.,.,.,.,.,.,.,.,.,X
X,.,X,.,X,X,.,X,X,X,.,X,.,X
.,.,X,.,X,X,.,X,X,X,.,X,.,X
X,.,X,.,X,X,.,X,X,X,.,X,.,X
X,.,X,.,.,.,.,.,O,.,.,.,.,X
X,.,X,.,X,X,X,X,X,X,X,X,.,X
X,.,.,.,.,.,.,.,.,.,.,.,.,X
X,X,X,X,X,X,X,X,X,X,X,X,X,X`

};

test('CSV file parsing', () => {
  for (const chunkPart in sampleCsvFiles) {
    if (sampleCsvFiles.hasOwnProperty(chunkPart)) {
      const csvFile = sampleCsvFiles[chunkPart];
      console.log(`Map:\n${csvFile}`);
      const actualChunk = Board.parseMap(csvFile);
      console.log(`Chunk:\n${actualChunk}`);
      expect(actualChunk).toBeDefined();
    }
  }
});

import Graph from './Graph';
import { List } from 'immutable';

describe('Test shortest path', () => {
  it('works for a small evenly-weighted graph ', () => {
    const testGraph = new Graph;
    testGraph.addVertex('1');
    testGraph.addVertex('2');
    testGraph.addVertex('3');
    testGraph.addVertex('4');
    testGraph.addVertex('5');
    testGraph.addVertex('6');
    testGraph.addBidirectionalEdge('1', '5', 1);
    testGraph.addBidirectionalEdge('1', '2', 1);
    testGraph.addBidirectionalEdge('5', '2', 1);
    testGraph.addBidirectionalEdge('5', '4', 1);
    testGraph.addBidirectionalEdge('2', '3', 1);
    testGraph.addBidirectionalEdge('3', '4', 1);
    testGraph.addBidirectionalEdge('4', '6', 1);

    expect(testGraph.computeShortestRoute('6', '1')).toEqual(List(['6', '4', '5', '1']));
  });
});

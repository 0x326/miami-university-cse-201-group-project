import DirectedWeightedGraph from './DirectedWeightedGraph';
import { List, Set } from 'immutable';

describe('Test graph with non-primitive vertex IDs', () => {
  const testGraph = new DirectedWeightedGraph<List<number>>();

  it('adds successfully (same instance)', () => {
    const vertex1 = List([1, 2]);
    const vertex2 = List([2, 1]);
    testGraph.addVertex(vertex1);
    testGraph.addVertex(vertex2);
    testGraph.addEdge(vertex1, vertex2, 1);
  });

  it('adds successfully (different instance; same data)', () => {
    testGraph.addEdge(List([1, 2]), List([2, 1]), 1);
  });

});

describe('Test shortest path', () => {

  it('works for a small evenly-weighted graph ', () => {
    const testGraph = new DirectedWeightedGraph<string>();
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

  it('works for a medium weighted graph', () => {
    const vertices = Set<string>([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
    ]);
    const edges = Set<string>([
      'A-C 5',
      'C-E 6',
      'E-G 2',
      'F-G 1',
      'D-F 9',
      'B-D 2',
      'A-B 3',
      'A-D 6',
      'C-D 2',
      'C-F 3',
      'C-G 7',
      'F-E 5'
    ]);
    const testGraph = new DirectedWeightedGraph<string>();
    vertices.valueSeq().forEach(vertex => vertex !== undefined && testGraph.addVertex(vertex));
    // tslint:disable:no-any
    for (let [vertex1, vertex2, cost] of edges.valueSeq().map(str => str !== undefined && str.split(/[- ]/)) as any) {
      cost = Number(cost);
      testGraph.addBidirectionalEdge(vertex1, vertex2, cost);
    }

    expect(testGraph.computeShortestRoute('A', 'G')).toEqual(List('A-C-F-G'.split('-')));
  });

});

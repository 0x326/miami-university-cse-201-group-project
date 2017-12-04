import { List, Set, Map } from 'immutable';

/**
 * Represents a vertex in a graph.
 *
 * This is an aggregate of Graph.
 */
class Vertex<Id> {
  readonly id: Id;
  edges: Set<Edge<Id>>;

  constructor(id: Id, edges: Set<Edge<Id>> = Set()) {
    this.id = id;
    this.edges = edges;
  }
}

/**
 * Represents an edge in a graph.
 *
 * This is an aggregate of Graph.
 */
class Edge<Id> {
  readonly from: Vertex<Id>;
  readonly to: Vertex<Id>;
  readonly cost: number;

  constructor(from: Vertex<Id>, to: Vertex<Id>, cost: number) {
    this.from = from;
    this.to = to;
    this.cost = cost;
  }
}

/**
 * Represents a particular calculation in Dijkstra's algorithm.
 */
class NetCost<Id> {
  cost: number = Infinity;
  associatedEdge?: Edge<Id>;
  isOptimal: boolean = false;
}

/**
 * A graph data structure.
 */
class DirectedWeightedGraph<Id> {
  private vertices: Map<Id, Vertex<Id>> = Map();
  private edges: Map<[Vertex<Id>, Vertex<Id>], Edge<Id>> = Map();

  /**
   * Computes the shortest path between the given vertices.
   *
   * Uses Dijkstra's algorithm.
   *
   * `O(n^2)`
   * @param from The starting vertex
   * @param to The goal vertex
   */
  computeShortestRoute(from: Id, to: Id): List<Id> {
    if (!this.vertices.keySeq().contains(from)) {
      throw `${from} is not in the graph`;
    } else if (!this.vertices.keySeq().contains(to)) {
      throw `${to} is not in the graph`;
    }

    let costTable = Map<Id, NetCost<Id>>(this.vertices.keySeq().map(key => [key, new NetCost]));
    costTable = costTable.update(from, costCalculation => {
      costCalculation.cost = 0;
      costCalculation.isOptimal = true;
      return costCalculation;
    });

    let currentNode = from;
    while (!costTable.every(calculation => calculation !== undefined && calculation.isOptimal)) {
      const nodeEdges = this.vertices.get(currentNode).edges;
      const costIncrement = costTable.get(currentNode).cost;

      // tslint:disable:no-any
      // Immutable.js Set objects are incorrectly typed in its index.d.ts
      // Use ``any`` to override type errors
      for (const edge of nodeEdges.values() as any) {
        if (edge !== undefined && !costTable.get(edge.to.id).isOptimal) {
          const otherNode = edge.to;
          if (edge.cost + costIncrement < costTable.get(otherNode.id).cost) {
            // Update value in table
            costTable = costTable.update(otherNode.id, cost => {
              cost.cost = edge.cost + costIncrement;
              // Keep track of which edge caused this value to change
              cost.associatedEdge = edge;
              return cost;
            });
          }
        }
      }

      // Select lowest cost
      let minimumCalculation: number = Infinity;
      let minimumCalculationKey: Id | undefined = undefined;
      // tslint:disable:no-any
      // Immutable.js Map objects are incorrectly typed in its index.d.ts
      // Use ``any`` to override type errors
      for (const [key, calc] of costTable.entries() as any) {
        if (key !== undefined && calc !== undefined && !calc.isOptimal) {
          if (calc.cost < minimumCalculation) {
            minimumCalculation = calc.cost;
            minimumCalculationKey = key;
          }
        }
      }

      if (minimumCalculationKey === undefined) {
        throw 'minimumCalculationKey === undefined';
      }

      costTable = costTable.update(minimumCalculationKey, calc => {
        if (calc === undefined) {
          throw `minimumCalculationKey=${minimumCalculationKey} is not a key to costTable`;
        }
        calc.isOptimal = true;
        currentNode = <Id> minimumCalculationKey;
        return calc;
      });
    }

    let route = List<Id>([to]);
    currentNode = to;
    while (!route.contains(from)) {
      const optimalEdge = costTable.get(currentNode).associatedEdge;
      if (optimalEdge === undefined) {
        throw 'Optimal calculation does not have an associatedEdge';
      }

      currentNode = optimalEdge.from.id;
      route = route.push(currentNode);
    }

    return List(route.reverse());
  }

  /**
   * Adds a vertex to the graph.
   *
   * `O(log32 N)`
   * @param id An id for the vertex
   */
  addVertex(id: Id): void {
    const vertex = new Vertex(id);
    this.vertices = this.vertices.set(id, vertex);
  }

  /**
   * Adds a directed, weighted edge to the graph.
   *
   * `O(log32 N)`
   * @param from The id of the "from" vertex
   * @param to The id of the "to" vertex
   * @param cost The cost of the edge
   */
  addEdge(from: Id, to: Id, cost: number): void {
    if (!this.vertices.keySeq().contains(from)) {
      throw `From vertex with id ${from} cannot be found`;
    }
    if (!this.vertices.keySeq().contains(to)) {
      throw `To vertex with id ${to} cannot be found`;
    }

    const fromVertex = this.vertices.get(from);
    const toVertex = this.vertices.get(to);
    const edge = new Edge(fromVertex, toVertex, cost);
    fromVertex.edges = fromVertex.edges.add(edge);
    this.edges = this.edges.set([fromVertex, toVertex], edge);
  }

  /**
   * Adds a undirected, weighted edge to the graph.
   * (Alias for creating two directed edges to the graph).
   *
   * `O(log32 N)`
   * @param a The id of the first vertex
   * @param b The id of the second vertex
   * @param cost The cost of the edge
   */
  addBidirectionalEdge(a: Id, b: Id, cost: number) {
    this.addEdge(a, b, cost);
    this.addEdge(b, a, cost);
  }

}

export default DirectedWeightedGraph;

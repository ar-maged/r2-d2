/** @flow */

export type Item = 'R2D2' | 'TELEPORTAL' | 'OBSTACLE' | 'ROCK' | 'PAD';

export type Operator = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';

export type Dimensions = {
  m: number,
  n: number,
};

export type Coordinates = {
  x: number,
  y: number,
};

export type Cell = {
  items: Array<Item>,
  coordinates: Coordinates,
};

export type State = {
  grid: Array<Cell>,
  isTeleportalActivated: boolean,
};

export type Node = {
  state: State,
  parent: Node | null,
  operator: Operator | null,
  depth: number,
  pathCost: number,
};

export type Problem = {
  operators: Array<Operator>,
  initialState: State,
  stateSpace: (State, Array<Operator>) => Array<State>,
  goalTest: State => boolean,
  pathCost: (Array<Operator>) => number,
};

export type QueueingFunction = (Array<Node>, Array<Node>) => Array<Node>;

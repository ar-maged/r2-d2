/** @flow */

import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';
import { rootReducer, actionCreators } from './redux';
import { Grid } from './components';
import {
  generateRandomGrid,
  operators,
  items,
  generalSearch,
  enqueueAtFront,
  enqueueAtEnd,
  orderedInsert,
  retrace,
  doesCellContainItem,
  findCellByItem,
  findCellByCoordinates,
  filterCellsByItem,
  moveR2D2,
} from './logic';

import type { Cell, Node, Operator, Problem } from './flow';

class App extends Component<void, void> {
  store = {};

  constructor() {
    super();
    this.store = createStore(rootReducer);
  }

  componentDidMount() {
    const randomlyGeneratedGrid: Array<Cell> = generateRandomGrid();
    this.store.dispatch(actionCreators.setGrid(randomlyGeneratedGrid));

    const stateSpace = (state, operators) => {
      const { grid } = state;
      let possibleStates = [];

      const r2D2Cell: Cell | void = findCellByItem(grid, items.R2D2); // @FIXME: Remove void

      if (r2D2Cell) {
        const { coordinates: r2D2Coordinates } = r2D2Cell;

        operators.forEach(operator => {
          const newGrid = _.cloneDeep(grid);

          switch (operator.name) {
            case 'NORTH':
              const newR2D2Cell = findCellByCoordinates(grid, {
                x: r2D2Coordinates.x,
                y: r2D2Coordinates.y - 1,
              });

              if (newR2D2Cell) {
                if (
                  r2D2Coordinates.y === 0 ||
                  doesCellContainItem(newR2D2Cell, 'OBSTACLE')
                ) {
                  //go no where
                } else if (
                  newR2D2Cell.items.length === 0 ||
                  (newR2D2Cell.items.length === 1 &&
                    doesCellContainItem(newR2D2Cell, 'PAD')) ||
                  doesCellContainItem(newR2D2Cell, 'TELEPORTAL')
                ) {
                  newGrid.find(item => item.type === 'R2D2').type = 'EMPTY';
                  newGrid.find(
                    item => newR2D2Cell.x === item.x && newR2D2Cell.y === item.y
                  ).type =
                    'R2D2';
                }
              }
              // Going into wall

              break;
            case 'EAST':
              const newR2D2Cell = findCellByCoordinates(grid, {
                x: r2D2Coordinates.x + 1,
                y: r2D2Coordinates.y,
              });
              // @TODO: Compute new state & append to possible states
              break;
            case 'SOUTH':
              const newR2D2Cell = findCellByCoordinates(grid, {
                x: r2D2Coordinates.x,
                y: r2D2Coordinates.y + 1,
              });
              // @TODO: Compute new state & append to possible states
              break;
            case 'WEST':
              const newR2D2Cell = findCellByCoordinates(grid, {
                x: r2D2Coordinates.x - 1,
                y: r2D2Coordinates.y,
              });
              // @TODO: Compute new state & append to possible states
              break;
            default:
              return state;
          }
        });
      }

      return possibleStates;
    };

    const problem: Problem = {
      operators,
      initialState: {
        grid: randomlyGeneratedGrid,
        isTeleportalActivated: false,
      },
      stateSpace,
      goalTest: state => {
        const teleportalCell = findCellByItem(state.grid, 'TELEPORTAL');
        return (
          teleportalCell !== undefined &&
          doesCellContainItem(teleportalCell, 'R2D2') &&
          state.isTeleportalActivated
        );
      },
      pathCost: operators =>
        operators.reduce(
          (accumulator, operator) => accumulator + operator.cost,
          0
        ),
    };

    const goalNode: Node | null = generalSearch(problem, enqueueAtFront);
    // const goalNode = generalSearch(problem, enqueueAtEnd);
    // const goalNode = generalSearch(problem, orderedInsert);

    if (goalNode) {
      const operatorsSequence: Array<Operator> = retrace(goalNode);
      console.log(
        '✅ A solution was found!\n',
        JSON.stringify(operatorsSequence)
      );
    } else {
      console.log(
        '⛔ A solution for this problem using the specified queueing function cannot be found.'
      );
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <Grid />
      </Provider>
    );
  }
}

export default App;

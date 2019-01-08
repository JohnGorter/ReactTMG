import {render, Simulate, wait} from 'react-testing-library';
import React from 'react';
import 'jest-dom/extend-expect'
import Todos from '../Todos';

const todos = [{
  title: 'todo1'
},
{
  title: 'todo2'
}];

describe('Todos', () => {
  it('finds title', () => {
    const {getByText, getByTestId, container} = render(<Todos todos={todos} />);
  })

});
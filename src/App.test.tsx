import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('transformUsers', () => {
  it('renders learn react link', () => {
    render(<App/>);
    const textMainListElement = screen.getByText(/Main List/i);
    const textFruitsElement = screen.getByText(/Fruits/i);
    const textVegetablesElement = screen.getByText(/Vegetables/i);
    expect(textMainListElement).toBeInTheDocument();
    expect(textFruitsElement).toBeInTheDocument();
    expect(textVegetablesElement).toBeInTheDocument();
  });
})

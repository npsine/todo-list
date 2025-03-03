import React, {useReducer, useCallback, useRef, useEffect, memo, ReactElement} from 'react';
import './App.css';

type itemsType = {
  type: 'Fruit' | 'Vegetable';
  name: string;
  inMain: boolean;
};

const initialItems: itemsType[] = [
  { type: 'Fruit', name: 'Apple', inMain: true },
  { type: 'Vegetable', name: 'Broccoli', inMain: true },
  { type: 'Vegetable', name: 'Mushroom', inMain: true },
  { type: 'Fruit', name: 'Banana', inMain: true },
  { type: 'Vegetable', name: 'Tomato', inMain: true },
  { type: 'Fruit', name: 'Orange', inMain: true },
  { type: 'Fruit', name: 'Mango', inMain: true },
  { type: 'Fruit', name: 'Pineapple', inMain: true },
  { type: 'Vegetable', name: 'Cucumber', inMain: true },
  { type: 'Fruit', name: 'Watermelon', inMain: true },
  { type: 'Vegetable', name: 'Carrot', inMain: true },
];

type Action =
    | { type: 'MOVE_TO_TYPE'; item: itemsType }
    | { type: 'MOVE_BACK_IMMEDIATELY'; item: itemsType };

const listReducer = (state: itemsType[], action: Action): itemsType[] => {
  switch (action.type) {
    case 'MOVE_TO_TYPE':
      return state.map(item =>
          item.name === action.item.name ? { ...item, inMain: false } : item
      );
    case 'MOVE_BACK_IMMEDIATELY':
      return state.map(item =>
          item.name === action.item.name ? { ...item, inMain: true } : item
      );
    default:
      return state;
  }
};

function App(): ReactElement {
  const [items, dispatch] = useReducer(listReducer, initialItems);
  const timersRef = useRef<Map<string, number>>(new Map<string, number>());

  const moveToTypeColumn = useCallback((item: itemsType): void => {
    dispatch({ type: 'MOVE_TO_TYPE', item });

    const timerId = window.setTimeout(() => {
      dispatch({ type: 'MOVE_BACK_IMMEDIATELY', item });
      timersRef.current.delete(item.name);
    }, 5000);

    timersRef.current.set(item.name, timerId);
  }, []);

  const moveBackImmediately = useCallback((item: itemsType): void => {
    if (timersRef.current.has(item.name)) {
      window.clearTimeout(timersRef.current.get(item.name)!);
      timersRef.current.delete(item.name);
    }
    dispatch({ type: 'MOVE_BACK_IMMEDIATELY', item });
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(timerId => window.clearTimeout(timerId));
    };
  }, []);

  return (
      <div className="container">
        <Column
            title="Main List"
            items={items.filter(item => item.inMain)}
            onClick={moveToTypeColumn}
            className="item-button"
        />
        <Column
            title="Fruits"
            items={items.filter(item => item.type === 'Fruit' && !item.inMain)}
            onClick={moveBackImmediately}
            className="type-button fruit"
        />
        <Column
            title="Vegetables"
            items={items.filter(item => item.type === 'Vegetable' && !item.inMain)}
            onClick={moveBackImmediately}
            className="type-button vegetable"
        />
      </div>
  );
}

type ColumnProps = {
  title: string;
  items: itemsType[];
  onClick: (item: itemsType) => void;
  className?: string;
}

const Column = memo(({ title, items, onClick, className }: ColumnProps): ReactElement => (
    <div className="column">
      <h2>{title}</h2>
      {items.map(item => (
          <ItemButton key={item.name} item={item} onClick={onClick} className={className} />
      ))}
    </div>
));

type ItemButtonProps = {
  item: itemsType;
  onClick: (item: itemsType) => void;
  className?: string;
}

const ItemButton = memo(({ item, onClick, className }: ItemButtonProps): ReactElement => (
    <button onClick={() => onClick(item)} className={className}>
      {item.name}
    </button>
));

export default App;

import React, {memo, ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import './App.css';

type itemsType = {
  type: 'Fruit' | 'Vegetable',
  name: string,
}

export const initialItems: itemsType[] = [
  { type: 'Fruit', name: 'Apple' },
  { type: 'Vegetable', name: 'Broccoli' },
  { type: 'Vegetable', name: 'Mushroom' },
  { type: 'Fruit', name: 'Banana' },
  { type: 'Vegetable', name: 'Tomato' },
  { type: 'Fruit', name: 'Orange' },
  { type: 'Fruit', name: 'Mango' },
  { type: 'Fruit', name: 'Pineapple' },
  { type: 'Vegetable', name: 'Cucumber' },
  { type: 'Fruit', name: 'Watermelon' },
  { type: 'Vegetable', name: 'Carrot' },
];

type ListState = {
  main: itemsType[],
  fruits: itemsType[],
  vegetables: itemsType[],
}

function App(): ReactElement {
  const [lists, setLists] = useState<ListState>({
    main: initialItems,
    fruits: [],
    vegetables: [],
  });
  const timersRef = useRef<{[key: string]: number}>({});

  const updateLists = useCallback((newState: Partial<typeof lists>): void => {
    setLists(prev => ({ ...prev, ...newState }));
  }, []);

  const removeFromTypeColumn = useCallback((item: itemsType): void => {
    const target = item.type === 'Fruit' ? 'fruits' : 'vegetables';
    updateLists({
      [target]: lists[target].filter(i => i.name !== item.name),
      main: [...lists.main, item]
    });
  },[lists, updateLists]);

  const moveToTypeColumn = useCallback((item: itemsType): void => {
    updateLists({ main: lists.main.filter(i => i.name !== item.name) });

    timersRef.current[item.name] = window.setTimeout(() => {
      removeFromTypeColumn(item);
      updateLists({main: [...lists.main, item]});
    }, 5000);

    const target = item.type === 'Fruit' ? 'fruits' : 'vegetables';
    updateLists({ [target]: [...lists[target], item] });
  }, [lists, removeFromTypeColumn, updateLists]);

  const moveBackImmediately = useCallback((item: itemsType): void => {
    window.clearTimeout(timersRef.current[item.name]);
    delete timersRef.current[item.name];

    const target = item.type === 'Fruit' ? 'fruits' : 'vegetables';
    updateLists({
      [target]: lists[target].filter(i => i.name !== item.name),
      main: [...lists.main, item]
    });
  }, [lists, updateLists]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(timerId => {
        window.clearTimeout(timerId);
      });
    };
  }, []);

  return (
    <div className="container">
      <Column
        title="Main List"
        items={lists.main}
        onClick={moveToTypeColumn}
        className="item-button"
      />
      <Column
        title="Fruits"
        items={lists.fruits}
        onClick={moveBackImmediately}
        className="type-button fruit"
      />
      <Column
        title="Vegetables"
        items={lists.vegetables}
        onClick={moveBackImmediately}
        className="type-button vegetable"
      />
    </div>
  );
}

const Column = memo(({ title, items, onClick, className }: {
  title: string,
  items: itemsType[],
  onClick: (item: itemsType) => void,
  className?: string
}): ReactElement => (
  <div className="column">
    <h2>{title}</h2>
    {items.map(item => (
      <ItemButton
        key={item.name}
        item={item}
        onClick={onClick}
        className={className}
      />
    ))}
  </div>
));

const ItemButton = memo(({ item, onClick, className }: {
  item: itemsType,
  onClick: (item: itemsType) => void,
  className?: string
}): ReactElement => (
    <button
        onClick={() => onClick(item)}
        className={className}
    >
      {item.name}
    </button>
));


export default App;

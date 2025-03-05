# Demo

[![Live Demo](https://img.shields.io/badge/demo-live%20demo-green)](https://todo-list-seven-sigma-27.vercel.app/)

## Alternative Implementation (Without Redux)

```tsx
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
```

## Transform Data from API https://dummyjson.com/users

```json
{
  Engineering: {
    male: 2,
    female: 2,
    ageRange: '26-40',
    hair: { Brown: 1, White: 1, Red: 1, Gray: 1 },
    addressUser: {
      EmilyJohnson: '29112',
      AlexanderJones: '86684',
      NoahHernandez: '73696',
      MadisonCollins: '62091'
    }
  },
  Support: {
    male: 4,
    female: 1,
    ageRange: '33-45',
    hair: { Green: 1, Blonde: 2, Purple: 1, Blue: 1 },
    addressUser: {
      MichaelWilliams: '38807',
      JamesDavis: '68354',
      EthanMartinez: '72360',
      EvelynSanchez: '43423',
      DanielCook: '58781'
    }
  },
  'Research and Development': {
    male: 0,
    female: 1,
    ageRange: '42',
    hair: { White: 1 },
    addressUser: { SophiaBrown: '32822' }
  },
  'Human Resources': {
    male: 0,
    female: 2,
    ageRange: '28-30',
    hair: { White: 1, Blue: 1 },
    addressUser: { EmmaMiller: '26593', AbigailRivera: '11407' }
  },
  'Product Management': {
    male: 0,
    female: 2,
    ageRange: '22-29',
    hair: { Gray: 1, Purple: 1 },
    addressUser: { OliviaWilson: '83843', LilyLee: '41540' }
  },
  Marketing: {
    male: 1,
    female: 2,
    ageRange: '27-32',
    hair: { Red: 1, Blonde: 1, Gray: 1 },
    addressUser: {
      AvaTaylor: '24771',
      IsabellaAnderson: '89352',
      WilliamGonzalez: '78243'
    }
  },
  Services: {
    male: 2,
    female: 1,
    ageRange: '29-38',
    hair: { Red: 1, Black: 1, Blonde: 1 },
    addressUser: { LiamGarcia: '57252', HenryHill: '81783', AddisonWright: '54698' }
  },
  Accounting: {
    male: 1,
    female: 4,
    ageRange: '24-36',
    hair: { Purple: 2, Gray: 1, Green: 1, Black: 1 },
    addressUser: {
      MiaRodriguez: '41810',
      CharlotteLopez: '42044',
      AveryPerez: '30973',
      MateoNguyen: '20673',
      EvelynGonzalez: '84898'
    }
  },
  Training: {
    male: 1,
    female: 0,
    ageRange: '31',
    hair: { Green: 1 },
    addressUser: { LoganTorres: '78805' }
  },
  Legal: {
    male: 2,
    female: 1,
    ageRange: '27-34',
    hair: { Red: 2, Purple: 1 },
    addressUser: {
      JacksonEvans: '26600',
      ElijahStewart: '31585',
      HarperKelly: '69521'
    }
  },
  Sales: {
    male: 0,
    female: 1,
    ageRange: '39',
    hair: { Red: 1 },
    addressUser: { ChloeMorales: '54972' }
  }
}
```

## Test result
- Implement test with jest

![Test result](https://i.imgur.com/LNrjrfo.png)
import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  memo,
  forwardRef,
} from "react";
import styled from "styled-components";
import { pure } from "recompose";
import axios from "axios";

//https://www.robinwieruch.de/javascript-fundamentals-react-requirements

/**
 * Use hooks with function component
 * @param {} props
 */
export default function GreetingsHooks(props) {
  /*
    Now every time the Function Component rerenders, the count is stored into the browser's local storage.
    Every time you fresh the browser page, the count from the browser's local storage, in case there is a count in the storage, is set as initial state.
    */
  const initialCount = +localStorage.getItem("storageCount") || 0;

  const [name, setName] = useState("Hello");
  const [surname, setSurname] = useState("Kumar");
  console.log("Does it render?");
  const [count, setCount] = useState(initialCount);
  console.log(`My count is ${count}!`);
  /**
   *every time (no argument)
   *only on mount and unmount ([] argument)
   *only when a certain variable changes (e.g. [count] argument)
   */
  useEffect(() => {
    console.log("Inside useEffect");
    localStorage.setItem("storageCount", count);
  }, [count]);
  /*  function handleChangeName(e){
        setName(e.target.value)
    } */
  const handleChangeName = e => setName(e.target.value);
  const handleChangeSurname = e => setSurname(e.target.value);
  const handleIncrement = () => setCount(currentCount => currentCount + 1);
  const handleDecrement = () => setCount(currentCount => currentCount - 1);
  const ref = useRef();

  useEffect(() => ref.current.focus(), []); //Run only on mount and unount
  const HigherOrderComponent = WithLoadingUseClassOnly(FetchDataByHooks);
  const HD = WithLoadingWithArrowFunction(FetchDataByHooks);
  const FHS = WithLoadingWithFunction(FetchDataByHooks);
  const HDDestructure = WithLoadingDestructure(FetchDataByHooks);
  return (
    <Fragment>
      <Count count={count}></Count>
      <Input value={name} onChangeInput={handleChangeName} />
      <Input value={surname} onChangeInput={handleChangeSurname} />
      <Button text={"Increment"} handleClick={handleIncrement}></Button>
      <ButtonAnother text={"Decrement"} handleClick={handleDecrement} />
      <UseRef value={name} handleChange={handleChangeName}></UseRef>
      <UseOfForwardRef
        value={name}
        handleChange={handleChangeName}
        ref={ref}></UseOfForwardRef>
      <Square number={20} />
      <SquareFunction number={20} />
      <SquarePureComponent number={20} />
      <HigherOrderComponent isLoading={true} />
      <HD isLoading={true} />
      <FHS isLoading={false} />
      <HDDestructure isLoading={false} />
    </Fragment>
  );
}

/**
 * Destructure props in function component argument
 * @param  param0
 */
const Input = ({ value, onChangeInput, children }) => (
  <label>
    {children}
    <input type="text" value={value} onChange={onChangeInput} />
  </label>
);

/**
 * Define default props with function component
 * @param {handleClick} param0
 */
const Button = ({ handleClick = () => console.log("Not provided"), text }) => {
  return (
    <button type="button" onClick={handleClick}>
      {text}
    </button>
  );
};

const ButtonAnother = ({ handleClick, text }) => (
  <button type="button" onClick={handleClick}>
    {text}
  </button>
);
ButtonAnother.defaultProps = {
  handleClick: () => console.log("Default"),
};
/**
 * Use memo to avoid rendering
 * It will render when props has changed
 * @param {*} param0
 */
const Count = memo(({ count }) => {
  console.log("Does it (re)render?");
  return <h1>{count}</h1>;
});

/**
 * A React Ref should only be used in rare cases such as accessing/manipulating the DOM manually (e.g. focus element), animations, and integrating third-party DOM libraries (e.g. D3)
 * @param {*} param0
 */
const UseRef = ({ value, handleChange }) => {
  const ref = useRef();
  useEffect(() => ref.current.focus(), []);
  return <input type="text" value={value} onChange={handleChange} ref={ref} />;
};

const UseOfForwardRef = forwardRef(({ value, handleChange }, ref) => {
  return <input type="text" value={value} onChange={handleChange} ref={ref} />;
});

/**
 * React's PureComponent does a shallow compare on the component's props and state.
 * If nothing has changed, it prevents the rerender of the component.
 * If something has changed, it rerenders the component.
 */

class Square extends React.PureComponent {
  render() {
    return <Item>{this.props.number * this.props.number}</Item>;
  }
}

const SquareFunction = ({ number }) => {
  console.log("Square function");
  return <Item>{number * number}</Item>;
};

const Item = styled.div`
  margin: 10px;
`;

/**
 * As alternative, if you want to use a functional stateless component as PureComponent instead, use recompose's pure higher-order component.
 * Under the hood, recompose applies React's PureComponent for you.
 */
const SquarePureComponent = pure(({ number }) => {
  console.log("SquarePureComponent function");
  return <Item>{number * number}</Item>;
});

/**
 * In a React Function Component, fetching data looks slightly different with React Hooks:
 * In the end, async/await is just another way of resolving promises in asynchronous JavaScript.
 */
const FetchDataByHooks = () => {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://api.mydomain.com");
      setData(response.data);
    };
    fetchData();
  }, []);
  return <div>{data}</div>;
};

function doFilter(query) {
  return function(user) {
    return user.name.includes(query);
  };
}

const doFilterByArrowFunction = query => user => user.name.includes(query);

const App = () => {
  const users = [{ name: "Robin" }, { name: "Markus" }];
  const [query, setQuery] = React.useState("");
  const handleChange = event => {
    setQuery(event.target.value);
  };
  return (
    <div>
      <ul>
        {users.filter(doFilter(query)).map(user => (
          <li>{user.name}</li>
        ))}
      </ul>
      <input type="text" onChange={handleChange} />
    </div>
  );
};

/**
 * SHORTHAND OBJECT ASSIGNMENT
 */
/*
const name = 'Robin';
const user = {
  name: name,
};
When the property name in your object is the same as your variable name, you can do the following:

const name = 'Robin';
const user = {
  name,
};

// without shorthand method names
var userService = {
  getUserName: function (user) {
    return user.firstname + ' ' + user.lastname;
  },
};
// shorthand method names
const userService = {
  getUserName(user) {
    return user.firstname + ' ' + user.lastname;
  },
};

const userService = {
  getUserName: (user) =>{
    return user.firstname + ' ' + user.lastname;
  },
};

const getUserName = (user) =>{
    return user.firstname + ' ' + user.lastname;
  }
const userService = {
  getUserName
};

// normal usage of key property in an object
var user = {
  name: 'Robin',
};
// computed key property for dynamic naming
const key = 'name';
const user = {
  [key]: 'Robin',
};
*/

/**
 * DESTRUCTURING IN REACT
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
 *
 * The destructuring assignment syntax is a JavaScript expression that makes it possible to unpack values from arrays, or properties from objects, into distinct variables.
 */

/*
 const state = { isLoadingcounter: 1, list: ['a', 'b'] };
// no object destructuring
const list = state.list;
const counter = state.counter;
// object destructuring
const { list, counter } = state;
 
 // no destructuring
function Greeting(props) {
  return <h1>{props.greeting}</h1>;
}
// destructuring
function Greeting({ greeting }) {
  return <h1>{greeting}</h1>;
}
The destructuring works for JavaScript arrays too:

const list = ['a', 'b'];
// no array destructuring
const itemOne = list[0];
const itemTwo = list[1];
// array destructuring
const [itemOne, itemTwo] = list;

const state = { counter: 1, list: ['a', 'b'] };
// rest destructuring
const { list, ...rest } = state;
console.log(list);
// output: ['a', 'b']
console.log(rest);
// output: { counter: 1 }

 */

/**
 * SPREAD OPERATOR IN REACT
 */
/*
 
 const userCredentials = { firstname: 'Robin' };
const userDetails = { nationality: 'German' };
const user = {
  ...userCredentials,
  ...userDetails,
};
console.log(user);
// output: { firstname: 'Robin', nationality: 'German' }

const App = () => {
  const users = [
    { name: 'Robin', nationality: 'German' },
    { name: 'Markus', nationality: 'American' },
  ];
  return (
    <ul>
      {users.map(user => <li>
        <User
          name={user.name}
          nationality={user.nationality}
        />
      </li>)}
    </ul>
  );
};
const User = ({ name, nationality }) =>
  <span>{name} from {nationality}</span>;

  Rather than passing all properties of an object property by property, you can use the spread operator to pass all key value pairs to the next component.

  const App = () => {
  const users = [
    { name: 'Robin', nationality: 'German' },
    { name: 'Markus', nationality: 'American' },
  ];
  return (
    <ul>
      {users.map(user => <li>
        <User {...user} />
      </li>)}
    </ul>
  );
};

 */
/**
 * higher-order component.
 */
function withLoading(Component) {
  return class WithLoading extends React.Component {
    render() {
      const { isLoading, ...rest } = this.props;
      if (isLoading) {
        return <p>Loading</p>;
      }
      return <Component {...rest} />;
    }
  };
}

/**
 * Higher order component using inner nested component
 * @param {*} Component
 */
function WithLoadingUseClassOnly(Component) {
  return class extends React.Component {
    render() {
      console.log("Higher order component");
      const { isLoading, ...rest } = this.props;
      if (!isLoading) {
        console.log("Loading from Higher order component");
        return <p>Loading</p>;
      }
      return <Component {...rest} />;
    }
  };
}

/**
 * Higher order component using function component
 * @param {*} Component
 */
const WithLoadingWithArrowFunction = Component => props => {
  const { isLoading, ...rest } = props;
  console.log("WithLoadingWithArrowFunction component");
  return isLoading ? (
    <Component {...rest} />
  ) : (
    <p>Loading WithLoadingWithArrowFunction</p>
  );
};

const WithLoadingWithFunction = Component => {
  return function(props) {
    const { isLoading, ...rest } = props;
    console.log("WithLoadingWithFunction component");
    return isLoading ? (
      <Component {...rest} />
    ) : (
      <p>Loading WithLoadingWithFunction</p>
    );
  };
};

//https://www.robinwieruch.de/react-higher-order-components
const WithLoadingDestructure = Component => ({ isLoading, ...rest }) => {
  console.log("HDDestructure component");
  return isLoading ? <Component {...rest} /> : <p>Loading HDDestructure</p>;
};

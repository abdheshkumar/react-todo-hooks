import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Greetings from "./Greetings";
import GreetingsHooks from "./GreetingsHooks";
function App() {
  return (
    <div className="App">
      <header>
        <Greetings></Greetings>
        <GreetingsHooks />
      </header>
    </div>
  );
}

export default App;

import React from "react";
export default class Greetings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Test",
    };
    //this.handleChangeName = this.handleChangeName.bind(this);
  }
  //If you are initializing state at component level then you should use arrow function
  /*  state = {
        name: "Hello"
    } */
  handleChangeName = e => {
    console.log(e.target.value);
    this.setState({
      name: e.target.value,
    });
  };
  render() {
    return (
      <input value={this.state.name} onChange={this.handleChangeName}></input>
    );
  }
}

import { useEffect, useState } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const fetchInitialData = async () => {
    console.log(lottery);
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getAllPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    console.log(manager);
    console.log(players);

    setManager(manager);
    setPlayers(players);
    setBalance(balance);
  };

  useEffect(() => {
    fetchInitialData().catch((error) => console.log(error));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("Waiting on transaction success...");
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);

    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });

    setMessage("You have been entered!");
  };

  const onClick = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({ from: accounts[0] });
    setMessage("A winner has been picked!");
  };

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>Contract's Players {players.length}</p>
      <p>Contract's Balance {web3.utils.fromWei(balance, "ether")}</p>

      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of Ether to enter</label>
          <input type="number" value={value} onChange={(event) => setValue(event.target.value)} />
        </div>
        <button type="submit">Enter</button>
        <p>{message}</p>

        <hr />
        <h4>Let's give it a try!</h4>
        <button onClick={onClick}>Pick a winner!</button>
        <hr />
      </form>
    </div>
  );
}

export default App;

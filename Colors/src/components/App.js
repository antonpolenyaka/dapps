import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Color from '../abis/Color.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Considera utilizar un monedero (Metamask o similar)');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Cargar cuenta
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    // O poner fijo, sobretodo si da problemas, ej.:= '5777' (id de Ganache)
    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if (networkData) {
      const abi = Color.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
      // Funcion 'totalSupply' del Smart Contract 
      const totalSupply = await contract.methods.totalSupply().call(); // call si no consumimos gas y send() si enviamos datos a grabar
      this.setState({ totalSupply });
      // Carga de colores
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call();
        this.setState({ colors: [...this.state.colors, color] });
      }
    }
    else {
      window.alert('Smart Contract no desplegado en la red!');
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      accont: '',
      contract: null,
      totalSupply: 0,
      colors: []
    }
  }

  // Funcion del contracto llamada mediante el contrato que colocamos en state del react
  mint = (color) => {
    console.log('Nuevo NFT en procedimiento!');
    // enviamos datos a blockchain
    this.state.contract.methods.mint(color).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ colors: [...this.state.colors, color] });
      });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://frogames.es/rutas-de-aprendizaje"
            target="_blank"
            rel="noopener noreferrer"
          >
            DApp
          </a>
          <ul className="navbar-nav px-3">
            <li className="navitem text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span className="account">{(this.state.account) ? this.state.account : 'account not connected'}</span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>DApp de un colleccionable de NFT's</h1>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  const color = this.color.value;
                  this.mint(color);
                }}>

                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Ej.: #FFFFFF"
                    ref={(input) => { this.color = input }} />

                  <input
                    type="submit"
                    className="btn btn-block btn-primary"
                    value='Nuevo NFT' />

                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {
              this.state.colors.map((color, key) => {
                return (
                  <div key={key} className='col-md-3 mb-3'>
                    <div
                      className='token'
                      style={{ backgroundColor: color }}>
                    </div>
                    <div>{color}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;

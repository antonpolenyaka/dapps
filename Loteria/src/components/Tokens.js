import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contrato_loteria from '../abis/loteria.json';
import tokens from '../imagenes/tokens.png'

class Tokens extends Component {
    async componentWillMount() {
        // Carga de Web3
        // Carga de datos de Blockchain
    }

    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enabled();
        }
        else if(window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('No hay ningún navegador detectado. Deberías considerar de usar Metamask!');
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]});
        console.log("Account:", this.state.account);
        const networkId = '5777'; // Ganache 5777, rinkeby 4, BSC 97
        console.log('Network id:', networkId);
        const networkData = contrato_loteria.networks[networkId];
        console.log("Network data:", networkData);

        if(networkData) {
            
        }
    }
}

export default Tokens;
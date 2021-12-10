import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contrato_loteria from '../abis/loteria.json';
import {Icon} from 'semantic-ui-react';
import premios from '../imagenes/winner.png';

class Premios extends Component {
    async componentWillMount() {
        // Carga de Web3
        await this.loadWeb3();
        // Carga de datos de Blockchain
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
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
            const abi = contrato_loteria.abi;
            console.log("abi", abi);
            const address = contrato_loteria.address;
            console.log("address", address);
            const contract = new web3.eth.Contract(abi, address);
            this.setState({contract});
        } else {
            window.alert('El Smart Contract no se ha desplegado en la red!');
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            contract: null,
            account: "",
            loading: false,
            errorMessage: ""
        }
    }

    render() {
        return (
            <p>Premios de loteria</p>
        );
    }
}

export default Premios;
// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.4 <0.7.0;
import "./ERC20.sol";

contract Main {

    // Clase del token
    ERC20Basic private token;

    // Direccion del propietario
    address public owner;

    // Direccion del contrato
    address public contrato;

    constructor () public {
        token = new ERC20Basic(10000);
        owner = msg.sender;
        contrato = address(this);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function getContract() public view returns(address) {
        return contrato;
    }

    // En esta funciona no hay compra de los tokens, son gratuitos
    function send_tokens(address _destinatario, uint _numTokens) public {
        token.transfer(_destinatario, _numTokens);
    } 

    function balance_direccion(address _direccion) public view returns(uint) {
        return token.balanceOf(_direccion);
    }

    function balance_contrato() public view returns(uint) {
        return token.balanceOf(contrato);
    }

}
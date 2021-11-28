const { assert } = require("chai");
//require('chai').use(require('chai-as-promised')).should()

const Main = artifacts.require('Main');

contract('Main', accounts => {
    it('Funcion: getOwner()', async () => {
        let instance = await Main.deployed();
        let addressOwnerEsperada = accounts[0];
        let direccionOwnerReal = await instance.getOwner.call();

        console.log('Direccion del owner (esperada):', addressOwnerEsperada);
        console.log('Direccion del owner (real):', direccionOwnerReal);

        assert.equal(addressOwnerEsperada, direccionOwnerReal);
    });

    it('Funcion: send_tokens(address _destinatario, uint _numTokens)', async () => {
        let instance = await Main.deployed();
        let inicialBalanceDireccion = await instance.balance_direccion.call(accounts[0]);
        let inicialBalanceContrato = await instance.balance_contrato.call();
        console.log('Balance del accounts[0] (antes):', inicialBalanceDireccion);
        console.log('Balance del contrato (antes):', inicialBalanceContrato);

        await instance.send_tokens(accounts[0], 10, {from: accounts[0]}); // enviamos 10 tokens

        let balanceDireccion = await instance.balance_direccion.call(accounts[0]);
        let balanceContrato = await instance.balance_contrato.call();
        console.log('Balance del accounts[0] (despues):', balanceDireccion);
        console.log('Balance del contrato (despues):', balanceContrato);

        // Verificaciones
        assert.equal(balanceDireccion, parseInt(inicialBalanceDireccion) + 10);
        assert.equal(balanceContrato, parseInt(inicialBalanceContrato) - 10); // Total al crear contrato menos 10 (que hacemos la transferencia)
    });

});
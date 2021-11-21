const { assert } = require('chai');
const Color = artifacts.require('./Color.sol');

require('chai').use(require('chai-as-promised')).should();

contract('Color', (accounts) => {
    let contract;

    before(async () => {
        contract = await Color.deployed();
    });

    describe('deployment', async () => {
        it('Despliegue exitoso', async () => {
            const address = contract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('Tiene un nombre', async () => {
            const name = await contract.name();
            assert.equal(name, 'Color');
        });

        it('Tiene un simbolo', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'COLOR');
        });
    });

    describe('minting', async () => {
        it('Creacion de un nuevo token', async () => {
            const result = await contract.mint('#EC058E')
            const totalSuply = await contract.totalSupply();
            // Exitoso
            assert.equal(totalSuply, 1);
            // Recogemos primer evento del log
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 1, 'Id correcto');
            // Primer token siempre se envia desde direccion 0 a direccion X
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'Dirección from correcta');
            assert.equal(event.to, accounts[0], 'Dirección to correcta');
            // Test no exitoso (añadimos el mismo color)
            await contract.mint('#EC058E').should.be.rejected;
        });
    });

    describe('Indexing', async () => {
        it('Lista de colores', async () => {
            await contract.mint('#5386E4');
            await contract.mint('#FFFFFF');
            await contract.mint('#000000');
            const totalSuply = await contract.totalSupply();

            let color;
            let result = [];

            for (var i = 1; i <= totalSuply; i++) {
                color = await contract.colors(i - 1);
                result.push(color);
            }

            let expected = ['#EC058E', '#5386E4', '#FFFFFF', '#000000']; // Inlcuyendo color de otro test, ya que esta en el mismo contrato
            assert.equal(result.join(','), expected.join(','));
        });
    });
});
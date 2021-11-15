const notas = artifacts.require('notas');

contract('notas', accounts => {

    it('1. Funcion: Evaluar(string memory _asignatura, string memory _idAlumno, uint _nota)', async () => {
        let instance = await notas.deployed();
        const tx = await instance.Evaluar('Matematicas','77755N', 9, { from: accounts[0] });
        console.log(accounts[0]);
        console.log(tx);
        const nota_alumno = await instance.VerNotas.call('Matematicas','77755N', { from: accounts[1] });
        console.log(nota_alumno);
        assert(nota_alumno, 9);
    });

    it('2. Funcion: Revision(string memory _asignatura, string memory _idAlumno)', async () => {
        let instance = await notas.deployed();
        const rev1 = await instance.Revision('Matematicas','77755N', { from: accounts[1] });
        const rev2 = await instance.Revision('Matematicas','12345X', { from: accounts[2] });
        console.log(rev1);
        console.log(rev2);
        // id revision = id alumno
        const id_revisiones = await instance.VerRevisiones.call('Matematicas',{ from: accounts[0] });
        console.log(id_revisiones);
        assert(id_revisiones[0], '77755NN');
        assert(id_revisiones[1], '12345X');
    });

});
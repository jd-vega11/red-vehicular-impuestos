/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Clase necesaria para administrar los estados de un objeto comercial
const State = require('./../ledger-api/state.js');

// Estados en los que se puede encontrar un impuesto
const cpState = {
    GENERADO: 1,
    PAGADO: 2,
    VALIDADO: 3
};

/**
 * La clase Impuesto extiende de la clase State. Recuerde que almacenamos estados de los objetos comerciales
 * Esta clase sera usada por la aplicacion que ejecuta las transacciones y por el smart contract que las contiene.
 * Gracias a esta implementacion es posible encapsular la logica que permite definir un impuesto.
 */
class Impuesto extends State {

    constructor(obj) {
	// Al crear un impuesto es necesario definir una llave unica. Esta llave esta compuesta por la placa del carro y el año a pagar.
        super(Impuesto.getClass(), [obj.placa, obj.anioPagar]);
        Object.assign(this, obj);
    }

    /**
     * Metodos para agregar la informacion del pago (banco y fecha)
     */

    setBanco(banco) {
        this.banco = banco;
    }

    setFechaDePago(fechaPago) {
        this.fechaPago = fechaPago;
    }

    /**
     * Metodos para administrar el ciclo de vida del impuesto
     */

    setGenerado() {
        this.currentState = cpState.GENERADO;
    }

    setPagado() {
        this.currentState = cpState.PAGADO;
    }

    setValidado() {
        this.currentState = cpState.VALIDADO;
    }

    isGenerado() {
        return this.currentState === cpState.GENERADO;
    }

    isPagado() {
        return this.currentState === cpState.PAGADO;
    }

    isValidado() {
        return this.currentState === cpState.VALIDADO;
    }

    static fromBuffer(buffer) {
        return Impuesto.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserializar los datos del estado en un impuesto.
     * @param {Buffer} datos para reconstruir el objeto comercial (impuesto)
     */
    static deserialize(data) {
        return State.deserializeClass(data, Impuesto);
    }

    /**
     * Metodo para crear un nuevo impuesto.
     */
    static createInstance(placa, tipoDoc, numDoc, fechaGen, anioPagar, valor, refPago) {
        return new Impuesto({ placa, tipoDoc, numDoc, fechaGen, anioPagar, valor, refPago });
    }

    static getClass() {
        return 'org.redvehicular.impuesto';
    }
}

module.exports = Impuesto;

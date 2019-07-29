/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Clase para manejar colecciones de estados
const StateList = require('./../ledger-api/statelist.js');

const Impuesto = require('./impuesto.js');

class ImpuestoList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.redvehicular.impuestolist');
        this.use(Impuesto);
    }

    async addImpuesto(impuesto) {
        return this.addState(impuesto);
    }

    async getImpuesto(impuestoKey) {
        return this.getState(impuestoKey);
    }

    async updateImpuesto(impuesto) {
        return this.updateState(impuesto);
    }
}


module.exports = ImpuestoList;

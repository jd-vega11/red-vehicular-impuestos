/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * Esta aplicación sigue un proceso de 6 pasos:
 * 1. Seleccionar una identidad desde un wallet.
 * 2. Conectarse al gateway de la red
 * 3. Acceder a la red vehicular
 * 4. Construir una petición para generar un impuesto
 * 5. Enviar la transacción
 * 6. Procesar la respuesta
 */

'use strict';

// Fabric SDK network class y otras utilidades
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const Impuesto = require('../contract/lib/impuesto.js');

// Una billetera (wallet) almacena una colección de identidades para su uso.
const wallet = new FileSystemWallet('../identity/user/sandrarueda/wallet');

async function main() {

  // Una gateway define los peers utilizados para acceder a las redes de Fabric
  const gateway = new Gateway();

  try {

    const userName = 'User1@org1.example.com';

    // Se carga el perfil de conexión. Se utilizará para localizar el gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

  
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled:false, asLocalhost: true }
    };

    console.log('Connect to Fabric gateway.');

    //Se realiza la conexión al gateway usando las opciones previamente definidas.
    await gateway.connect(connectionProfile, connectionOptions);

    
    console.log('network channel: mychannel.');
    
    //Se accede a la red vehicular
    const network = await gateway.getNetwork('mychannel');

    
    console.log('Se usa el contrato inteligente de org.redvehicular.impuesto');

    //Se obtiene el contrato inteligente
    const contract = await network.getContract('impuestocontract', 'org.redvehicular.impuesto');

    // Se genera un impuesto
    console.log('Se envia la transaccion VALIDAR para ser procesada por el contrato');

    const repuesta = await contract.submitTransaction('validar', 'ABC323','2019');

    // process response
    console.log('Se procesa la respuesta enviada por el contrato inteligente');

    let impuesto = Impuesto.fromBuffer(repuesta);

    console.log(`Se valida impuesto para vehiculo de placa: ${impuesto.placa} por valor de ${impuesto.valor} para el año ${impuesto.anioPagar}`);

    console.log('Transacción completa.');

  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);

  } finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.')
    gateway.disconnect();

  }
}
main().then(() => {

  console.log('Generar program complete.');

}).catch((e) => {

  console.log('Generar program exception.');
  console.log(e);
  console.log(e.stack);
  process.exit(-1);

});

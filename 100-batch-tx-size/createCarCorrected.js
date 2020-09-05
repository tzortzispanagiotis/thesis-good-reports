

const contractID = 'fabcar';
const version = '1.0';

const colors = ['blue', 'red', 'green', 'yellow', 'black', 'purple', 'white', 'violet', 'indigo', 'brown'];
const makes = ['Toyota', 'Ford', 'Hyundai', 'Volkswagen', 'Tesla', 'Peugeot', 'Chery', 'Fiat', 'Tata', 'Holden'];
const models = ['Prius', 'Mustang', 'Tucson', 'Passat', 'S', '205', 'S22L', 'Punto', 'Nano', 'Barina'];
const owners = ['Tomoko', 'Brad', 'Jin Soo', 'Max', 'Adrianna', 'Michel', 'Aarav', 'Pari', 'Valeria', 'Shotaro'];


let bc, ctx, clientArgs, clientIdx, txIdx;
let maxEndorseTime, maxOrdererTime, maxCommitTime, allEndorseTimes, allOrdererTimes, allCommitTimes;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    ctx = context;
    clientArgs = args;
    clientIdx = context.clientIdx.toString();
    console.log(bc);
    console.log(context);
    txIdx = 0;
    maxEndorseTime = -1;
    maxOrdererTime = -1;
    maxCommitTime = -1;
    allEndorseTimes = 0;
    allOrdererTimes = 0;
    allCommitTimes = 0;
};

function logMapElements(value, key, map) {
  console.log(`m[${key}] = ${value}`);
}

module.exports.run = async function() {
    //console.log(txIdx);
    //console.log('I am running...');
    txIdx++;
    let carNumber = 'Client' + clientIdx + '_CAR' + txIdx.toString();
    const randomId = Math.floor(Math.random()*clientArgs.assets);
    let carColor = colors[Math.floor(Math.random() * colors.length)];
    let carMake = makes[Math.floor(Math.random() * makes.length)];
    let carModel = models[Math.floor(Math.random() * models.length)];
    let carOwner = owners[Math.floor(Math.random() * owners.length)];
    const myArgs = {
        chaincodeFunction: 'createCar',
        //invokerIdentity: 'client0.org2.example.com',
        chaincodeArguments: [carNumber, carMake, carModel, carColor, carOwner]
    };
    let results =  await bc.bcObj.invokeSmartContract(ctx, contractID, version, myArgs, 30);
    for (let result of results) {
       //console.log(txIdx+' txidx')
      // console.log('newMap!');
       let custom = result.GetCustomData();
       startTime = result.GetTimeCreate();
       endorseTime = custom.get('time_endorse');
       ordererAck = custom.get('time_orderer_ack');
       endTime = result.GetTimeFinal();
        //console.log('Time from submit to endorse success= '+ (endorseTime - startTime));
	//console.log('time from endorse success to orderer received ack= ' + (ordererAck - endorseTime));
	//console.log('Time from orderer ack to final = ' + (endTime - ordererAck));
	if ((endorseTime - startTime) > maxEndorseTime) {
	  maxEndorseTime = (endorseTime - startTime);
	}      
	if ((ordererAck - endorseTime) > maxOrdererTime) {
	  maxOrdererTime = (ordererAck - endorseTime); 
	}
	if ((endTime - ordererAck) > maxCommitTime) {
	  maxCommitTime = (endTime - ordererAck);
	}
        allEndorseTimes += (endorseTime - startTime);
	allOrdererTimes += (ordererAck - endorseTime);
	allCommitTimes += (endTime - ordererAck);
//result.GetCustomData().forEach(logMapElements);

    }
    //let customData = results.GetId();
    //customData.forEach(logMapElements);
    //console.log(customData);
    return results;
};

module.exports.end = async function() {
	let allTimes = allEndorseTimes + allOrdererTimes + allCommitTimes;
	console.log('Client ' + clientIdx + ' max endorse time = ' + maxEndorseTime / 1000 +'ms');
	console.log('Client ' + clientIdx + ' max ordererAck time= ' + maxOrdererTime / 1000 +'ms');
	console.log('Client ' + clientIdx + ' max commit time= ' + maxCommitTime / 1000 +'ms');
	console.log('Client ' + clientIdx + ' total transactions = ' + txIdx);
	console.log('Client ' + clientIdx + ' transactions spent ' + (allEndorseTimes * 100 / allTimes) + '% time in endorsement ,' + 
			+ (allOrdererTimes * 100 / allTimes) + '% time for orderer response, ' + (allCommitTimes * 100 / allTimes) + 'time in commit await');
};

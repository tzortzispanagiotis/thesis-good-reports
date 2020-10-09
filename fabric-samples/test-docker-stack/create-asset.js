/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Investigate submitTransaction() using network model to create an asset of specific size in the registry
// - label: create-asset-100
//     chaincodeID: fixed-asset
//     txNumber:
//     - 1000
//     rateControl:
//     - type: fixed-rate
//       opts:
//         tps: 50
//     arguments:
//       chaincodeID: fixed-asset | fixed-asset-base
//       bytesize: 100
//     callback: benchmark/network-model/lib/create-asset.js

module.exports.info  = 'Creating Asset in Registry';

let chaincodeID;
// const appmetrics = require('appmetrics');
// require('appmetrics-dash').monitor({appmetrics: appmetrics});
// appmetrics.enable('profiling');
const bytes = (s) => {
    return ~-encodeURI(s).split(/%..|./).length;
};

let txIndex = 0;
let clientIdx;
let asset;
let bc, contx, bytesize;
let maxEndorseTime, maxOrdererTime, maxCommitTime, allEndorseTimes, allOrdererTimes, allCommitTimes;
let worstEndorser, worstCommiter;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientIdx = context.clientIdx;
    chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
    bytesize = args.bytesize;

    asset = {docType: chaincodeID, content: ''};
    asset.creator = 'client' + clientIdx;
    asset.bytesize = bytesize;

    const rand = 'random';
    let idx = 0;
    while (bytes(JSON.stringify(asset)) < bytesize) {
        const letter = rand.charAt(idx);
        idx = idx >= rand.length ? 0 : idx+1;
        asset.content = asset.content + letter;
    }

    contx = context;
    maxEndorseTime = -1;
    maxOrdererTime = -1;
    maxCommitTime = -1;
    allEndorseTimes = 0;
    allOrdererTimes = 0;
    allCommitTimes = 0;

    worstEndorser;
    worstCommiter;
};

module.exports.run = function() {
    const uuid = 'client' + clientIdx + '_' + bytesize + '_' + txIndex;
    asset.uuid = uuid;
    txIndex++;
    const myArgs = {
        chaincodeFunction: 'createAsset',
        chaincodeArguments: [uuid, JSON.stringify(asset)]
    };
    let results =  bc.bcObj.invokeSmartContract(contx, chaincodeID, undefined, myArgs, 45);
    for (let result of results) {
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
           worstEndorser = custom;
         }
         if ((ordererAck - endorseTime) > maxOrdererTime) {
           maxOrdererTime = (ordererAck - endorseTime);
         }
         if ((endTime - ordererAck) > maxCommitTime) {
           maxCommitTime = (endTime - ordererAck);
           worstCommiter = custom;
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

module.exports.end = function() {
    let allTimes = allEndorseTimes + allOrdererTimes + allCommitTimes;
    console.log('Client ' + clientIdx + ' max endorse time = ' + maxEndorseTime / 1000 +'ms');
    console.log('Client ' + clientIdx + ' max ordererAck time= ' + maxOrdererTime / 1000 +'ms');
    console.log('Client ' + clientIdx + ' max commit time= ' + maxCommitTime / 1000 +'ms');
    console.log('Client ' + clientIdx + ' total transactions = ' + txIdx);
    console.log('Client ' + clientIdx + ' transactions spent ' + (allEndorseTimes * 100 / allTimes) + '% time in endorsement ,' +
                    + (allOrdererTimes * 100 / allTimes) + '% time for orderer response, ' + (allCommitTimes * 100 / allTimes) + 'time in commit await');
    console.log('worst endorser custom data: '+worstEndorser);
    console.log('worst endorser custom data: '+worstCommiter);
    //return Promise.resolve();
};

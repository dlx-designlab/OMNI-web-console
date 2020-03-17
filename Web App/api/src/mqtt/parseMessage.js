// MIT License
// Copyright (C) 2019-Present Takram

import moment from 'moment'

// The format of payload is:
// {
//   gw: [ - Gateway data
//     {
//       date: String - Time of data reception (UTC)
//       rssi: Integer - Received signal strength
//       snr: Float - S/N ratio
//       gwid: String - Gateway ID
//     },
//     ...
//   ],
//   mod: { - Module (device) data
//     fq: Float - Signal frequency
//     cnt: Integer - Counter value in server
//     data: String - Data in hexadecimal notation
//     mt: String - Whether this is ACK request (confirm) or not (unconfirm)
//     devEUI: String - Module (device) unique address
//     dr: Integer - DR value (combination of spread factor and bandwidth)
//     port: Integer - LoRa port number
//   }
// }

export default function parseMessage (message) {
  const {
    gw: [gw],
    mod
  } = JSON.parse(message)
  return {
    date: moment(gw.date).toDate(),
    rssi: gw.rssi,
    snr: gw.snr,
    gatewayId: gw.gwid,
    frequency: mod.fq,
    counter: mod.cnt,
    data: mod.data,
    type: mod.mt,
    deviceId: mod.devEUI,
    dataRate: mod.dr,
    port: mod.port
  }
}

// MIT License
// Copyright (C) 2019-Present Takram

export default function parseData (data) {
  const values = new Float32Array(
    new Uint8Array(Buffer.from(data, 'hex')).buffer
  )
  const [
    latitude,
    longitude,
    altitude,
    temperature1,
    temperature2,
    temperature3,
    salinity,
    satellite
  ] = values
  return {
    latitude,
    longitude,
    altitude,
    temperature1,
    temperature2,
    temperature3,
    salinity,
    satellite
  }
}

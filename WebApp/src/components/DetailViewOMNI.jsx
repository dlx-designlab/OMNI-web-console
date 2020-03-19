// import { LineLayer } from '@deck.gl/layers'
import { useQuery } from '@apollo/react-hooks'
import download from 'downloadjs'
import gql from 'graphql-tag'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'

import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import GetAppIcon from '@material-ui/icons/GetApp'

import DataGraph from './DataGraph'

import classes from './App.scss'

const COLORS = ['#89c648', '#d83527']

var salinity = ['Not available']
var temp = ['Not available']
var omnitemp = ['Not available']
var timesinceupdate = ['Not available']

function getOMNIdata (deviceId) {
  const GET_MESSAGES_OMNI = gql`
    query getMessages($deviceId: ID) {
      messages(
        deviceId: $deviceId
        orderBy: { field: "date", direction: DESC }
        perPage: 100000
      ) {
        date
        rssi
        device {
          id
          name
        }
        data {
          latitude
          longitude
          altitude
          temperature1
          temperature2
          temperature3
          salinity
          satellite
        }
      }
    }
  `
  const { data = { devices: [] } } = useQuery(GET_MESSAGES_OMNI, {
    variables: { deviceId: deviceId }
  })
  return data
}

// function getallOMNIdata (deviceId, devicefirstdata, now) {
//   const GET_MESSAGES_OMNIS = gql`
//   query getMessages ($deviceId: ID, $dateTime: Date, $nowdateTime: Date) {
//     messages(deviceId: $deviceId from: $dateTime to: $nowdateTime orderBy: { field: "date", direction: DESC }) {
//       date
//       rssi
//       device {
//         id
//         name
//       }
//       data {
//         latitude
//         longitude
//         altitude
//         temperature1
//         temperature2
//         temperature3
//         salinity
//         satellite
//       }
//     }
//   }
// `

//   const { data = { devices: [] } } = useQuery(GET_MESSAGES_OMNIS, {
//     variables: { dateTime: devicefirstdata, deviceId: deviceId, nowdateTime: now }
//   })
//   return data
// }

const variabledata = {
  temperature1: {
    Name: 'OMNI Temperature',
    Description:
      'The OMNI temperature is the temperature of the onboard arduino, it is an indication of OMNI health and can be used to detect faults.',
    Units: '°C'
  },
  temperature2: {
    Name: 'Water Temperature',
    Description:
      'The water tempertaure is measured using a thermistor at a depth of approximatly 20cm into the water.',
    Units: '°C'
  },
  temperature3: {
    Name: 'Salinity',
    Description:
      'Salinity is the measure of the dissolved salts in the sea water. It is measured by measuring the current that can be passed through the water.',
    Units: 'µS/cm'
  }
}

export default function DetailViewOMNI ({
  info,
  omnidata,
  onGraphInteract,
  onBackClick,
  firstdevicedata,
  onCommunityClick
}) {
  var diff = []
  var health = []
  const deviceId = String(info.info.id)
  const [omnihealth, setomnihealth] = useState([])
  const [dataTypeState, setDataTypeState] = useState('temperature1')
  const [brushState, setBrushState] = useState([])

  const data = getOMNIdata(deviceId)
  if (typeof data.messages !== 'undefined' && omnihealth.length === 0) {
    if (data.messages.length === 1) {
      setomnihealth([
        { name: 'On Time Messages', value: 0 },
        {
          name: 'Late Messages',
          value: 1
        }
      ])
    } else {
      for (var i = 0; i < data.messages.length - 1; i++) {
        const now = moment(data.messages[i].date)
        const end = moment(data.messages[i + 1].date)
        diff[i] = moment.duration(now.diff(end)).asMinutes()
        health[i] = diff[i] > 30.3 ? 0 : 1
      }
      if (omnihealth.length < 1) {
        setomnihealth([
          { name: 'On Time Messages', value: health.reduce((a, b) => a + b) },
          {
            name: 'Late Messages',
            value: health.length - health.reduce((a, b) => a + b)
          }
        ])
      }
    }
  }

  if (typeof data.messages !== 'undefined') {
    salinity = data.messages[0].data.temperature3.toFixed([2])
    temp = data.messages[0].data.temperature2.toFixed([2])
    omnitemp = data.messages[0].data.temperature1.toFixed([2])
    timesinceupdate = moment(new Date(data.messages[0].date)).fromNow()
  }

  const handleRadioClick = (event, o) => {
    setDataTypeState(o)
  }

  const handleGraphInteract = (location, o) => {
    onGraphInteract(location, o)
  }

  const handleBackClick = () => {
    onBackClick()
  }

  const linecolorfade = {
    temperature1: 'rgba(80,194,247,0.2)',
    temperature2: 'rgba(33,209,143,0.2)',
    temperature3: 'rgba(255,166,0,0.2)'
  }

  const handleCommunityClick = o => {
    onCommunityClick(o)
  }

  const onBrushStateChange = a => {
    setBrushState(a)
  }

  const getDownloadData = () => {
    var downloaddata = [
      'Date Time' +
        ',' +
        variabledata[dataTypeState].Name.toString() +
        '(' +
        variabledata[dataTypeState].Units.toString() +
        ')' +
        `
    `
    ].toString()
    for (var i = 0; i < data.messages.length - 1; i++) {
      downloaddata = downloaddata.concat([
        data.messages[i].date.toString() +
          ',' +
          data.messages[i].data[dataTypeState].toString() +
          `
      `
      ])
    }
    download(downloaddata, [
      info.info.name + ' ' + new Date().toISOString() + '.csv'
    ])
  }

  return (
    <div className={classes.detailview}>
      <div>
        <div className={classes.detailviewheading}>
          <br />
          <br />
          <IconButton>
            <ArrowBackIcon onClick={handleBackClick} />
          </IconButton>{' '}
          {info.info.name}
        </div>
        <div className={classes.detailviewtext}>
          <br />
          <i style={{ fontSize: 'small' }}>
            OMNI Type <br />
          </i>{' '}
          {info.info.version} <br />
          <br />
          <i style={{ fontSize: 'small' }}>
            Community <br />
          </i>{' '}
          <Link
            style={{ cursor: 'pointer' }}
            onClick={() => handleCommunityClick(info.info.community)}
          >
            {info.info.community}
          </Link>
          <br />
          <br />
          <i style={{ fontSize: 'small' }}>
            Last data recieved <br />
          </i>{' '}
          {timesinceupdate}
        </div>
        <div
          style={{ position: 'absolute', xIndex: 500000, top: 110, left: 400 }}
        >
          {/* <img src={HealthImg.default} width={200} /> <br /> */}
          {omnihealth.length < 1 && (
            <div
              style={{
                position: 'absolute',
                xIndex: 500000,
                top: 140,
                left: 650
              }}
            >
              <CircularProgress />
            </div>
          )}
          {omnihealth.length > 1 && (
            <PieChart width={200} height={200}>
              <Pie
                data={omnihealth}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                dataKey='value'
                // label
              >
                {omnihealth.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
          &nbsp; &nbsp; &nbsp;
          <div
            style={{
              position: 'absolute',
              xIndex: 500000,
              top: 210,
              left: 40,
              width: 200
            }}
          >
            Omni Health Status
          </div>
        </div>
      </div>
      <div className={classes.dataarea}>
        <Tabs
          value={dataTypeState}
          onChange={handleRadioClick}
          variant='fullWidth'
          // orientation="vertical"
          // indicatorColor='primary'
          // textColor='primary'
          // TabIndicatorProps={getColor()}
        >
          <Tab
            style={{
              backgroundColor:
                dataTypeState === 'temperature1'
                  ? linecolorfade.temperature1
                  : 'WhiteSmoke',
              minWidth: 50,
              height: '80px',
              borderTop:
                dataTypeState === 'temperature1'
                  ? 'grey 2px solid'
                  : 'WhiteSmoke 2px solid',
              fontFamily: 'Kulim Park, sans-serif'
            }}
            // icon={<GetAppIcon />}
            label={
              <div style={{ lineHeight: '15px' }}>
                {' '}
                <div style={{ display: 'inline', fontSize: 'x-large' }}>
                  {omnitemp}
                </div>
                °C{' '}
                <div style={{ display: 'inline', fontSize: 'x-small' }}>
                  <br />
                  OMNI Temperature{' '}
                </div>
              </div>
            }
            value='temperature1'
          />
          <Tab
            style={{
              backgroundColor:
                dataTypeState === 'temperature2'
                  ? linecolorfade.temperature2
                  : 'WhiteSmoke',
              minWidth: 50,
              borderTop:
                dataTypeState === 'temperature2'
                  ? 'grey 2px solid'
                  : 'WhiteSmoke 2px solid',
              fontFamily: 'Kulim Park, sans-serif'
            }}
            label={
              <div style={{ lineHeight: '15px' }}>
                <div style={{ display: 'inline', fontSize: 'x-large' }}>
                  {temp}
                </div>
                °C{' '}
                <div style={{ display: 'inline', fontSize: 'x-small' }}>
                  <br />
                  Water Temperature
                </div>{' '}
              </div>
            }
            value='temperature2'
          />
          <Tab
            style={{
              backgroundColor:
                dataTypeState === 'temperature3'
                  ? linecolorfade.temperature3
                  : 'WhiteSmoke',
              minWidth: 50,
              borderTop:
                dataTypeState === 'temperature3'
                  ? 'grey 2px solid'
                  : 'WhiteSmoke 2px solid',
              fontFamily: 'Kulim Park, sans-serif'
            }}
            label={
              <div style={{ lineHeight: '15px' }}>
                <div style={{ display: 'inline', fontSize: 'x-large' }}>
                  {salinity}
                </div>
                µS/cm{' '}
                <div style={{ display: 'inline', fontSize: 'x-small' }}>
                  <br />
                  Salinity
                </div>{' '}
              </div>
            }
            value='temperature3'
          />
        </Tabs>
      </div>
      <div
        className={classes.datatext}
        style={{ backgroundColor: linecolorfade[dataTypeState] }}
      >
        <h3>{variabledata[dataTypeState].Name}</h3>
        <p style={{ fontSize: 'small' }}>
          <i style={{ fontSize: 'x-small' }}>Unit </i>
        </p>
        <p>{variabledata[dataTypeState].Units}</p>
        <p style={{ fontSize: 'x-small' }}>
          <i>Description</i>
        </p>
        <p style={{ fontSize: 'small' }}>
          {variabledata[dataTypeState].Description}
        </p>
      </div>
      <div style={{ position: 'absolute', left: 10, bottom: 160 }}>
        <IconButton onClick={() => getDownloadData()}>
          <GetAppIcon />
        </IconButton>
        Download data
      </div>
      <div className={classes.datagraph}>
        {useCallback(
          <DataGraph
            plotdata={data}
            datatype={dataTypeState}
            onGraphInteract={handleGraphInteract}
            brushState={brushState}
            handleBrushStateChange={onBrushStateChange}
          />,
          [data, dataTypeState, brushState]
        )}
      </div>
    </div>
  )
}

// import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import { FlyToInterpolator } from 'react-map-gl'

import Communities from './data/communities.json'
import DetailViewCommunity from './DetailViewCommunity'
import DetailViewOMNI from './DetailViewOMNI'
import LayerSelect from './LayerSelect'
import MapVis from './MapVis'
import StoriesPage from './StoriesPage'
import TopBar from './TopBar'

import classes from './App.scss'

// import Divider from '@material-ui/core/Divider'
// import IconButton from '@material-ui/core/IconButton'
// import ChevronRightIcon from '@material-ui/icons/ChevronRight'
// import ZushiWorkshop from './images/Zushi Workshop.jpg'

var yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)

// const GET_MESSAGES = gql`
//   query getMessages {
//     messages(orderBy: { field: "date", direction: DESC } perPage: 1000) {
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
const GET_LAST_MESSAGE = gql`
  query getLastMessage {
    devices {
      name
      id
      messages(orderBy: { field: "date", direction: DESC }, perPage: 1) {
        date
        data {
          latitude
          longitude
          temperature1
          temperature2
          temperature3
        }
      }
    }
  }
`

const GET_FIRST_MESSAGE = gql`
  query getLastMessage {
    devices {
      name
      id
      messages(orderBy: { field: "date", direction: ASC }, perPage: 1) {
        date
        data {
          latitude
          longitude
          temperature1
          temperature2
          temperature3
        }
      }
    }
  }
`

function getOMNIposition (yesterday) {
  const querydate = yesterday.toISOString()
  const GET_MESSAGES_OMNIS = gql`
    query getMessages($dateTime: Date) {
      devices {
        name
        id
        messages(from: $dateTime) {
          date
          data {
            latitude
            longitude
          }
        }
      }
    }
  `

  const { data = { devices: [] } } = useQuery(GET_MESSAGES_OMNIS, {
    variables: { dateTime: querydate },
    pollInterval: 1000
  })
  return data
}

function getLastOMNIdata () {
  const omnidata = getOMNIposition(yesterday) // Run periodically
  const { data = { devices: [] } } = useQuery(GET_LAST_MESSAGE)
  const addLat = [
    0,
    0.5481131105957004,
    3.6569241105957033,
    0.5349981105957013,
    -0.6017348894042982,
    0.5581544443188946,
    0.4013920637135797,
    1.0186068625623932,
    0.03137649001982368,
    0.876626646499318,
    -7.122030149992021
  ]
  const addLon = [
    0,
    1.9552821044921984,
    3.834133104492196,
    2.049517104492196,
    -5.236584895507804,
    1.8544466694596053,
    1.6253328516392003,
    -2.3132795579594188,
    -0.21955813360335696,
    2.5132173462957894,
    -8.481894696089256
  ]

  var k = 0
  var lastomnidata = []
  if (data.devices.length !== 0) {
    for (var i = 0; i < omnidata.devices.length; i++) {
      if (data.devices[i].messages.length !== 0) {
        lastomnidata.push({
          dataid: 'OMNI',
          name: data.devices[i].name,
          id: data.devices[i].id,
          community: Communities.filter(o =>
            o.OMNIs.map(d => d.name).includes(data.devices[i].name)
          )[0].name,
          version: Communities.filter(o =>
            o.OMNIs.map(d => d.name).includes(data.devices[i].name)
          )[0].OMNIs.filter(a => a.name === data.devices[i].name)[0].version,
          lastonline: moment(
            new Date(data.devices[i].messages[0].date)
          ).fromNow(),
          online:
            new Date() - new Date(data.devices[i].messages[0].date) < 1800000 &&
            1,
          latitude: data.devices[i].messages[0].data.latitude + addLat[k],
          longitude: data.devices[i].messages[0].data.longitude + addLon[k],
          temperature: data.devices[i].messages[0].data.temperature2,
          salinity: data.devices[i].messages[0].data.temperature3
        })
        k++
      }
    }
  }
  return [lastomnidata, data]
}

export default function MapPage ({
  txt,
  onLanguageChange,
  viewState,
  onViewStateChange,
  onTourClick,
  onJoinClick,
  onAPIClick,
  onHomeClick,
  onEventsClick,
  onStoriesClick,
  onAboutClick
}) {
  const [clusterState, setClusterState] = useState(false)
  const [communityState, setCommunityState] = useState(true)
  const [omniState, setOmniState] = useState(true)

  const [showDetail, setShowDetail] = useState({
    show: false,
    info: []
  })

  const [omniPoint, setOMNIpoint] = useState(false)

  const { data = { devices: [] } } = useQuery(GET_FIRST_MESSAGE)
  const firstdevicedata = data

  // const { data = { messages: [] } } = useQuery(GET_MESSAGES)
  const omnidata = getOMNIposition(yesterday) // Run periodically

  var [lastomnidata, testdata] = getLastOMNIdata() // Run periodically
  lastomnidata = lastomnidata.filter(
    d => !isNaN(d.longitude) || !isNaN(d.latitude)
  )

  var zoom = viewState.zoom
  const handleMapChange = (d, type) => {
    if (type === 'graph') {
      const newviewstate = {
        longitude: d.longitude,
        latitude: d.latitude,
        zoom: zoom,
        pitch: 0,
        bearing: 0
      }
      onViewStateChange(newviewstate)
      setOMNIpoint(d)
    } else {
      zoom = d.zoom
      onViewStateChange(d)
    }
  }
  const handleBackClick = () => {
    setShowDetail({
      show: false,
      info: []
    })
  }

  const handleNavigationClick = useCallback(
    o => {
      if (o === 'Tour' && onTourClick != null) {
        onTourClick()
      } else if (o === 'Join' && onJoinClick != null) {
        onJoinClick()
      } else if (o === 'API' && onAPIClick != null) {
        onAPIClick()
      } else if (o === 'Stories' && onAPIClick != null) {
        onStoriesClick()
      } else if (o === 'Home') {
        onHomeClick()
      } else if (o === 'Events') {
        onEventsClick()
      } else if (o === 'About') {
        onAboutClick()
      }
    },
    [onTourClick, onJoinClick, onAPIClick, onStoriesClick]
  )

  const handleSearch = info => {
    var newviewstate = []
    if (info[0].searchtype === 'Community') {
      newviewstate = {
        longitude:
          Communities[Communities.findIndex(p => p.name === info[0].index)]
            .longitude,
        latitude:
          Communities[Communities.findIndex(p => p.name === info[0].index)]
            .latitude,
        zoom: 12,
        pitch: 0,
        bearing: 0,
        transitionDuration: 5000,
        transitionInterpolator: new FlyToInterpolator()
      }
    } else if (info[0].searchtype === 'OMNI' && lastomnidata.length !== 0) {
      newviewstate = {
        longitude:
          lastomnidata[lastomnidata.findIndex(o => o.name === info[0].index)]
            .longitude,
        latitude:
          lastomnidata[lastomnidata.findIndex(o => o.name === info[0].index)]
            .latitude,
        zoom: 12,
        pitch: 0,
        bearing: 0,
        transitionDuration: 5000,
        transitionInterpolator: new FlyToInterpolator()
      }
    }
    onViewStateChange(newviewstate)
    setClassState('smallbar')
    setShowDetail({
      show: false,
      info: []
    })
  }

  const handleLayerClick = useCallback(
    info => {
      if (showDetail.show === false && info != null) {
        setShowDetail({
          show: true,
          info: info
        })
        setClassState('smallbar')
      } else if (
        showDetail.show === true &&
        info.name === showDetail.info.name
      ) {
        setShowDetail({
          show: false,
          info: []
        })
      } else if (
        showDetail.show === true &&
        info.name !== showDetail.info.name
      ) {
        setShowDetail({
          show: true,
          info: info
        })
        setClassState('smallbar')
      } else {
        setShowDetail({
          show: false,
          info: []
        })
      }
    },
    [setShowDetail, showDetail]
  )

  function mapclass () {
    var mapclassname = []
    if (showDetail.show) {
      mapclassname = classes.detailmap
    } else {
      mapclassname = classes.root
    }
    return mapclassname
  }

  const [classState, setClassState] = useState('mediumbar')

  const handleOMNIClick = o => {
    setShowDetail({
      show: true,
      info: o
    })
    if (o.longitude) {
      const newviewstate = {
        longitude: o.longitude,
        latitude: o.latitude,
        zoom: viewState.zoom,
        pitch: 0,
        bearing: 0,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator()
      }
      onViewStateChange(newviewstate)
    }
  }

  const handleCommunityClick = o => {
    setShowDetail({
      show: true,
      info: Communities.filter(d => d.name === o)[0]
    })
    const newviewstate = {
      longitude: Communities.filter(d => d.name === o)[0].longitude,
      latitude: Communities.filter(d => d.name === o)[0].latitude,
      zoom: viewState.zoom,
      pitch: 0,
      bearing: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator()
    }
    onViewStateChange(newviewstate)
  }

  const handleLanguageChange = () => {
    onLanguageChange()
  }

  return (
    <div>
      {showDetail.show === false && (
        <LayerSelect
          clusterState={clusterState}
          communityState={communityState}
          omniState={omniState}
          onClusterClick={() => setClusterState(!clusterState)}
          onCommunityClick={() => setCommunityState(!communityState)}
          onOmniClick={() => setOmniState(!omniState)}
        />
      )}
      <div className={classes.navigationbox}>
        <TopBar
          onClick={o => handleNavigationClick(o)}
          omniplotdata={lastomnidata}
          onSearch={handleSearch}
          onLanguageChange={handleLanguageChange}
        />
      </div>
      <div className={classes.StoriesOuter}>
        <StoriesPage
          txt={txt}
          classState={classState}
          handleStoryStateChange={o => setClassState(o)}
          info={showDetail}
        />
      </div>
      <div className={mapclass()}>
        <MapVis
          clusterState={clusterState}
          communityState={communityState}
          omniState={omniState}
          omniplotdata={lastomnidata}
          viewState={viewState}
          onViewStateChange={handleMapChange}
          onLayerClick={handleLayerClick}
          info={showDetail}
          omniPoint={omniPoint}
        />
      </div>
      {showDetail.show === true && showDetail.info.dataid === 'community' && (
        <div className={classes.detailview}>
          <DetailViewCommunity
            info={showDetail}
            omniplotdata={lastomnidata}
            onBackClick={handleBackClick}
            onOMNIClick={handleOMNIClick}
          />
        </div>
      )}
      {showDetail.show === true && showDetail.info.dataid === 'OMNI' && (
        <DetailViewOMNI
          info={showDetail}
          // omnidata={omnidata}
          onGraphInteract={handleMapChange}
          onBackClick={handleBackClick}
          // firstdevicedata={firstdevicedata}
          onCommunityClick={handleCommunityClick}
        />
      )}
    </div>
  )
}

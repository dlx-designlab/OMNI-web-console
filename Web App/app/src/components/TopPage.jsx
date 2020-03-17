// import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { useCallback, useState } from 'react'
import { FlyToInterpolator } from 'react-map-gl'

import { IconButton } from '@material-ui/core'
import MapIcon from '@material-ui/icons/Map'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import TimelineIcon from '@material-ui/icons/Timeline'

import en from './data/text/en.json'
import CommunityIcon from './icons/CommunityIcon.png'
import OMNIIcon from './icons/OMNI Icon.png'
import OMNIChan from './icons/OMNI.png'
import OmniLogo from './icons/omnigif.gif'
import MapVis from './MapVis'
import StoriesPage from './StoriesPage'
import TopBar from './TopBar'

import classes from './App.scss'

var yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)

var activeChapterName = 'IntroBox'

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
    variables: { dateTime: querydate }
  })
  return data
}

export default function TopPage ({ onClick, onCloseClick }) {
  const [sticky, setSticky] = useState(false)
  const txt = en
  const [viewState, setViewState] = useState({
    latitude: 37.301865600722245,
    longitude: 136.25941767449692,
    zoom: 4,
    bearing: 0,
    pitch: 30,
    transitionDuration: 2000,
    transitionInterpolator: new FlyToInterpolator()
  })

  // const { data = { messages: [] } } = useQuery(GET_MESSAGES)
  const omnidata = getOMNIposition(yesterday)
  var omniplotdata = []
  if (omnidata.devices.length !== 0) {
    for (var i = 0; i < omnidata.devices.length; i++) {
      if (omnidata.devices[i].messages.length === 0) {
        omniplotdata.push({
          name: omnidata.devices[i].name,
          id: omnidata.devices[i].id,
          online: 'Offline',
          latitude: [],
          longitude: []
        })
      } else {
        omniplotdata.push({
          name: omnidata.devices[i].name,
          id: omnidata.devices[i].id,
          online: 'Online',
          latitude: omnidata.devices[i].messages[0].data.latitude,
          longitude: omnidata.devices[i].messages[0].data.longitude
        })
      }
    }
  }

  const handleViewStateChange = useCallback(
    viewState => {
      setViewState(viewState)
    },
    [setViewState]
  )

  const handleCloseClick = () => {
    onCloseClick()
  }

  var chapters = {
    IntroBox: {
      latitude: 35.290005,
      longitude: 139.480898,
      zoom: 5,
      bearing: 0,
      pitch: 30,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator()
    },
    Overview: {
      latitude: 35.290005,
      longitude: 139.480898,
      zoom: 5,
      bearing: 0,
      pitch: 30,
      transitionDuration: 10000,
      transitionInterpolator: new FlyToInterpolator()
    },
    Communities: {
      latitude: 35.290005,
      longitude: 139.480898,
      zoom: 8,
      bearing: 0,
      pitch: 30,
      transitionDuration: 10000,
      transitionInterpolator: new FlyToInterpolator()
    },
    OMNIs: {
      latitude: 35.290005,
      longitude: 139.480898,
      zoom: 11,
      bearing: 0,
      pitch: 30,
      transitionDuration: 10000,
      transitionInterpolator: new FlyToInterpolator()
    },
    Data: {
      latitude: 35.290005,
      longitude: 139.480898,
      zoom: 6,
      bearing: 0,
      pitch: 30,
      transitionDuration: 10000,
      transitionInterpolator: new FlyToInterpolator()
    },
    Stories: {
      latitude: 35.290005,
      longitude: 139.480898,
      zoom: 5,
      bearing: 0,
      pitch: 30,
      transitionDuration: 10000,
      transitionInterpolator: new FlyToInterpolator()
    },
    StoriesMedium: {
      longitude: 137.52015686035156,
      latitude: 34.75602340698242,
      zoom: 5,
      pitch: 0,
      bearing: 0,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator()
    },
    'Data Platform': {
      longitude: 137.52015686035156,
      latitude: 34.75602340698242,
      zoom: 5,
      pitch: 0,
      bearing: 0,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator()
    }
  }

  const handleScroll = () => {
    var chapterNames = Object.keys(chapters)
    for (var i = 0; i < chapterNames.length; i++) {
      var chapterName = chapterNames[i]
      if (isElementOnScreen(chapterName)) {
        setActiveChapter(chapterName)
        break
      }
    }
  }

  function setActiveChapter (chapterName) {
    if (chapterName === activeChapterName) return
    setViewState(chapters[chapterName])
    activeChapterName = chapterName
  }

  function isElementOnScreen (id) {
    var element = document.getElementById(id)
    var bounds = element.getBoundingClientRect()
    if (id === 'IntroBox' && bounds.top < 70) {
      setSticky(true)
    } else if (id === 'IntroBox' && bounds.top > 70) {
      setSticky(false)
    } else {
      setSticky(true)
    }
    return bounds.top < window.innerHeight && bounds.bottom > 0
  }
  return (
    <div>
      <div className={classes.root} style={{ pointerEvents: 'none' }}>
        <MapVis
          // data={data}
          omniplotdata={omniplotdata}
          viewState={viewState}
          onViewStateChange={handleViewStateChange}
          chapterState={activeChapterName}
        />
      </div>
      <div onScroll={handleScroll} className={classes.scrollstory}>
        <div className={classes.introbox} id='IntroBox'>
          <div className={classes.introtext}>
            <img src={OmniLogo} width={200} /> &nbsp; OMNI
          </div>
        </div>
        <div
          id='Skip'
          className={sticky ? classes.introsticky : classes.introclose}
          onClick={() => handleCloseClick()}
        >
          Skip to Map
          {/* // visible on all pages */}
          <IconButton>
            <SkipNextIcon />
          </IconButton>
        </div>
        <div className={classes.scrollstorytext}>
          <div className={classes.features} id='features'>
            <div style={{ height: '50%' }} />
            <section
              className={
                activeChapterName === 'Overview'
                  ? classes.sectionactive
                  : classes.section
              }
              id='Overview'
            >
              <h3
                style={{
                  verticalAlign: 'middle',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left'
                }}
              >
                <img src={OMNIChan} width={25} style={{}} />
                &nbsp; Welcome to OMNI
              </h3>
              <p>
                OMNI is a network of communities who are interested in learning
                more about the ocean. Communities are located throughout the
                world and are connected by a interest in the ocean and its
                preservation.
              </p>
            </section>
            <section
              className={
                activeChapterName === 'Communities'
                  ? classes.sectionactive
                  : classes.section
              }
              id='Communities'
            >
              <h3
                style={{
                  verticalAlign: 'middle',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left'
                }}
              >
                <img src={CommunityIcon} width={25} style={{}} />
                &nbsp; Communities
              </h3>
              <p>
                Communities are shown on the map with the blue community icon.
                Each induvidual community has their own interests and reasons
                for measuring the ocean. Some may be interested in the
                enviroment, others might want to know the wave height to see if
                today is a good day to surf.
              </p>
            </section>
            <section
              className={
                activeChapterName === 'OMNIs'
                  ? classes.sectionactive
                  : classes.section
              }
              id='OMNIs'
            >
              <h3
                style={{
                  verticalAlign: 'middle',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left'
                }}
              >
                <img src={OMNIIcon} width={25} style={{}} />
                &nbsp; OMNIs
              </h3>
              <p>
                OMNIs are shown on the map as yellow dots. OMNIs are devices
                that measure proprties about the ocean such as temperature and
                salinity. Devices are built and managed by communities who are
                interested in different ocean proprties.
              </p>
            </section>
            <section
              className={
                activeChapterName === 'Data'
                  ? classes.sectionactive
                  : classes.section
              }
              id='Data'
            >
              <h3
                style={{
                  verticalAlign: 'middle',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left'
                }}
              >
                <TimelineIcon width={25} style={{}} />
                &nbsp; OMNI Data
              </h3>
              <p>
                The datas OMNIs collected are relayed using the LoRa network and
                stored in a database operated by the universtiy of tokyo. The
                OMNI data can be accessed through the API or viewed via the
                online web platform. OMNIs are expected to broadcast every 30
                minutes and so the flashing red circles indicate an OMNI that
                has broadcasted within the last 30 minutes to show it is alive
                and working.
              </p>
            </section>
            <section
              className={
                activeChapterName === 'Data Platform'
                  ? classes.sectionactive
                  : classes.section
              }
              id='Data Platform'
            >
              <h3
                style={{
                  verticalAlign: 'middle',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left'
                }}
              >
                <MapIcon width={25} style={{}} />
                &nbsp; Data Platform
              </h3>
              <p>
                The data platform is the home of the OMNI community. It can be
                used to see the latest data and stories and connect with events
                and all things OMNI. The map view allows you to view all ocean
                data and find information about the communities using OMNI.
                Using the top bar information about OMNI events and
                documentation on how to use the API can be accesed.
              </p>
            </section>
            <section
              style={{ marginBottom: 'calc(100vh * 0.1)' }}
              className={
                activeChapterName === 'Stories'
                  ? classes.sectionactive
                  : classes.section
              }
              id='Stories'
            >
              <h3
                style={{
                  verticalAlign: 'middle',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left'
                }}
              >
                <div style={{ fontSize: '25px' }}>🌎</div>&nbsp; Stories
              </h3>
              <p>
                Collecting data is only the start of OMNI, it is what the
                community does with the data that matters. Stories is the way
                communities can share their work with the OMNI wide community.
                Stories can be found in the bottom tab of the app and can be
                expanded by scrolling up to see the stories related to the omni
                communities.
              </p>
            </section>
            <section
              id='StoriesMedium'
              style={{ marginBottom: 'calc(100vh * 1.3)' }}
            >
              <br />
            </section>
            <div
              onClick={() => handleCloseClick()}
              className={classes.exploretextbox}
            >
              Explore the OMNI world!
              <IconButton>
                <SkipNextIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      {/* {tourState === 2 &&
        <div className={classes.introtextbox}>
          <div className={classes.introtextboxtext}>
            OMNI is a network of communities who are interested in learning more about the ocean. Communities are located throughout the world and are connected by a interest in the ocean and its preservation.
          </div>
        </div>}
      {tourState === 3 &&
        <div className={classes.introtextbox}>
          <div className={classes.introtextboxtext}>
            OMNI communities are characterised by their connection to the ocean and each manage deployed measuring devices and run events such as workshops.
          </div>
        </div>}
      {tourState === 5 &&
        <div className={classes.exploretextbox}>
          <div
            className={classes.exploretextboxtext}
            onClick={() => handleCloseClick()}
          >
            Explore the OMNI world
          </div>
        </div>}
      {tourState !== 5 &&
        <div className={classes.nextarrowcontainer}>
          <div
            className={classes.nextarrow}
            onClick={() => handleClick()}
          >
            >
          </div>
        </div>} */}
      {(activeChapterName === 'Data Platform') |
        (activeChapterName === 'Stories') |
        (activeChapterName === 'StoriesMedium') && (
        <div className={classes.navigationbox}>
            <TopBar
            onClick={o => []}
            omniplotdata={[]}
            onSearch={o => []}
            onLanguageChange={o => []}
          />
          </div>
      )}
      {(activeChapterName === 'Stories') |
        (activeChapterName === 'StoriesMedium') && (
        <div className={classes.StoriesOuter}>
            <StoriesPage
            txt={txt}
            classState={
              activeChapterName === 'Stories' ? 'smallbar' : 'mediumbar'
            }
            handleStoryStateChange={o => []}
            info={[]}
          />
          </div>
      )}
    </div>
  )
}

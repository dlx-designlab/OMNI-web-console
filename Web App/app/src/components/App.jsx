import React, { useState } from 'react'

import AboutPage from './AboutPage'
import APIPage from './APIPage'
import en from './data/text/en.json'
import jp from './data/text/jp.json'
import EventPage from './EventPage'
import JoinPage from './JoinPage'
import MapPage from './MapPage'
import TopPage from './TopPage'

export default function App () {
  const [showIntroState, setShowIntroState] = useState(true)
  const [showJoinPageState, setShowJoinPageState] = useState(false)
  const [showAPIPageState, setShowAPIPageState] = useState(false)
  const [showEventPageState, setShowEventPageState] = useState(false)
  const [showAboutPageState, setShowAboutPageState] = useState(false)

  const [viewState, setViewState] = useState({
    longitude: 137.52015686035156,
    latitude: 34.75602340698242,
    zoom: 5,
    pitch: 0,
    bearing: 0,
    transitionDuration: 2000
    // transitionInterpolator: new FlyToInterpolator()
  })
  const [txt, setTxt] = useState(en)

  const handleLanguageChange = () => {
    if (txt === en) {
      setTxt(jp)
    } else {
      setTxt(en)
    }
  }

  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      {showIntroState && (
        <TopPage onCloseClick={() => setShowIntroState(false)} txt={txt} />
      )}
      {showIntroState === false && (
        <MapPage
          txt={txt}
          onLanguageChange={handleLanguageChange}
          viewState={viewState}
          onViewStateChange={o => {
            setViewState(o)
          }}
          onTourClick={() => {
            setShowIntroState(true)
            setShowJoinPageState(false)
            setShowAPIPageState(false)
            setShowEventPageState(false)
            setShowAboutPageState(false)
          }}
          onJoinClick={() => {
            setShowJoinPageState(true)
            setShowAPIPageState(false)
            setShowEventPageState(false)
            setShowAboutPageState(false)
          }}
          onAPIClick={() => {
            setShowAPIPageState(true)
            setShowJoinPageState(false)
            setShowEventPageState(false)
            setShowAboutPageState(false)
          }}
          onHomeClick={() => {
            setShowAPIPageState(false)
            setShowJoinPageState(false)
            setShowEventPageState(false)
            setShowAboutPageState(false)
          }}
          onEventsClick={() => {
            setShowAPIPageState(false)
            setShowEventPageState(true)
            setShowJoinPageState(false)
            setShowAboutPageState(false)
          }}
          onAboutClick={() => {
            setShowAPIPageState(false)
            setShowEventPageState(false)
            setShowJoinPageState(false)
            setShowAboutPageState(true)
          }}
        />
      )}
      {showJoinPageState && (
        <div>
          <JoinPage />
        </div>
      )}
      {showAPIPageState && (
        <div>
          <APIPage />
        </div>
      )}
      {showEventPageState && (
        <div>
          <EventPage />
        </div>
      )}
      {showAboutPageState && (
        <div>
          <AboutPage />
        </div>
      )}
    </div>
  )
}

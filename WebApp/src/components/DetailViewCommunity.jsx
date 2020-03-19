/* eslint-disable react/jsx-key */
// import { LineLayer } from '@deck.gl/layers'
import React from 'react'

import { Link } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import Communities from './data/communities.json'

// import ZushiPhoto from './icons/ZushiPhoto.png'
import classes from './App.scss'

const Surfimg = require('./icons/Surfing.png')
const AquaCultureimg = require('./icons/AquaCulture.png')
const Universityimg = require('./icons/University.png')
const Fishingimg = require('./icons/Fishing.png')
const Shellfishimg = require('./icons/Shellfish.png')
const Schoolimg = require('./icons/School.png')
const Onlineimg = require('./icons/Online.png')
const Offlineimg = require('./icons/Offline.png')
const Zushiimg = require('./icons/Zushi High School.png')
const DLXimg = require('./icons/DlX Design Lab.png')

const images = {
  Surf: Surfimg.default,
  AquaCulture: AquaCultureimg.default,
  University: Universityimg.default,
  Fishing: Fishingimg.default,
  Shellfish: Shellfishimg.default,
  School: Schoolimg.default,
  Online: Onlineimg.default,
  Offline: Offlineimg.default,
  'Zushi High School': Zushiimg.default,
  'DLX Design Lab': DLXimg.default
}

export default function DetailViewCommunity ({
  info,
  omniplotdata,
  onBackClick,
  onOMNIClick
}) {
  const view = info.info.name
  const handleOMNIClick = o => {
    onOMNIClick(omniplotdata.filter(d => d.name === o)[0])
  }
  const handleBackClick = () => {
    onBackClick()
  }
  return (
    <div>
      {info.info.dataid === 'community' && (
        <div>
          <br />
          <br />
          <br />
          <br />

          <div className={classes.detailviewheading}>
            <IconButton>
              <ArrowBackIcon onClick={handleBackClick} />
            </IconButton>{' '}
            {view}
          </div>
          <div className={classes.detailviewtext}>
            <br />
            <i style={{ fontSize: 'small' }}>
              Community type <br />
            </i>
            <p
              style={{
                verticalAlign: 'middle',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left'
              }}
            >
              <img
                width={20}
                src={
                  images[
                    Communities[Communities.findIndex(p => p.name === view)]
                      .type
                  ]
                }
              />
              &nbsp;
              {Communities[Communities.findIndex(p => p.name === view)].type}
            </p>
            <i style={{ fontSize: 'small' }}>
              Member since: <br /> <br />
            </i>{' '}
            3/10/2019 <br />
            <br />
            <h2>About</h2>
            <p>
              Information about the Community and their activites, what do they
              want to know about the ocean and how are they going about it?
            </p>
            <br />
            <p>We hope to.</p>
            <br />
            <p>
              <li>Gain a better understanding of our local sea.</li>
            </p>
          </div>
          <div className={classes.detailviewcommunityomnis}>
            <h2>OMNIs</h2>
            {Communities[Communities.findIndex(o => o.name === view)].OMNIs
              .length < 1 && <div>No OMNIs</div>}
            {omniplotdata
              .filter(o => info.info.OMNIs.map(d => d.name).includes(o.name))
              .map(item => (
                <div key={item.name}>
                  <Link
                    style={{ fontSize: 'large', cursor: 'pointer' }}
                    onClick={() => handleOMNIClick(item.name)}
                  >
                    {' '}
                    {item.name}{' '}
                  </Link>{' '}
                  <i style={{ fontSize: 'small' }}>Last Online:</i>{' '}
                  {item.lastonline} <br />
                  {/* <i style={{ fontSize: 'small' }}>Status:</i> {item.online ? 'Online' : 'Offline'} &nbsp; */}
                  <i style={{ fontSize: 'small' }}>Temperature:</i>{' '}
                  {item.temperature} &nbsp;
                  <i style={{ fontSize: 'small' }}>Salinity:</i>{' '}
                  {item.salinity.toFixed([2])} &nbsp; <br />
                  <br />
                </div>
              ))}
            <br />
          </div>
          <br />
          <p style={{ margin: 50, width: '40%', overflowY: 'auto' }}>
            <br />
            <br />
            <br />
          </p>
        </div>
      )}
    </div>
  )
}

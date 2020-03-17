import React from 'react'

import { Divider, Link } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Communities from './data/communities.json'
import FujiTv from './images/Fuji TV.png'
import HamanakoTest from './images/Hamanako Test.jpg'
import KamakuraMayor from './images/Kamakura Mayor.jpg'
import ZushiWorkshop from './images/Zushi Workshop.jpg'
import StoryPage from './StoryPage.jsx'

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

const DisplayStyle = {
  smallbar: {
    transform: 'translateY(calc(100vh - 66px))',
    pointerEvents: 'auto',
    transition: 'all .4s, opacity 500ms 500ms',
    WebkitTransition: '0.5s',
    MozTransition: '0.5s',
    OTransition: '0.5s',
    height: '100%',
    boxShadow:
      '0 -2px 5px 0 rgba(0, 0, 0, 0.15), 0 -4px 10px 0 rgba(0, 0, 0, 0.14)'
  },
  mediumbar: {
    transform: 'translateY(calc(100vh - 300px))',
    pointerEvents: 'auto',
    transition: 'all .4s',
    height: '100%',
    boxShadow:
      '0 -2px 5px 0 rgba(0, 0, 0, 0.15), 0 -4px 10px 0 rgba(0, 0, 0, 0.14)'
  },
  fullscreen: {
    transform: 'translateY(66px)',
    pointerEvents: 'auto',
    transition: 'all .4s',
    overflow: 'auto',
    height: '95%'
  },
  singlestory: {
    transform: 'translateY(66px)',
    pointerEvents: 'auto',
    transition: 'all .4s',
    overflow: 'auto',
    height: '95%'
  }
}

export default function StoriesPage ({
  txt,
  classState,
  handleStoryStateChange,
  info
}) {
  var k = 0
  const handleWheelEvent = o => {
    var elmnt = document.getElementById('stories')
    if (classState === 'fullscreen' && elmnt.scrollTop > 0) {
      return
    }
    {
      if (k === 0) {
        window.StartTime = Date.now()
      }
      const ima = Date.now()
      if (ima - window.StartTime < 10) {
        k = k + o.deltaY
      } else if (Math.abs(k) > 50) {
        setTimeout(function () {
          if (k > 0 && classState === 'smallbar') {
            handleStoryStateChange('mediumbar')
          } else if (k > 0 && classState === 'mediumbar') {
            handleStoryStateChange('fullscreen')
          } else if (k < 0 && classState === 'fullscreen') {
            handleStoryStateChange('mediumbar')
          } else if (k < 0 && classState === 'mediumbar') {
            handleStoryStateChange('smallbar')
          }
        }, 300)
        k = 0
      } else {
        k = 0
      }
    }
  }

  var smallbarClass = []
  var mediumbarClass = classes.StoriesPage
  var fullscreenClass = []
  var singlestoryClass = []
  if (classState === 'smallbar') {
    smallbarClass = classes.StoriesPage
    mediumbarClass = classes.InvisibleStoriesPage
    fullscreenClass = classes.InvisibleStoriesPage
    singlestoryClass = classes.InvisibleStoriesPage
  } else if (classState === 'mediumbar') {
    smallbarClass = classes.InvisibleStoriesPage
    mediumbarClass = classes.StoriesPage
    fullscreenClass = classes.InvisibleStoriesPage
    singlestoryClass = classes.InvisibleStoriesPage
  } else if (classState === 'fullscreen') {
    smallbarClass = classes.InvisibleStoriesPage
    mediumbarClass = classes.InvisibleStoriesPage
    fullscreenClass = classes.StoriesPage
    singlestoryClass = classes.InvisibleStoriesPage
  } else if (classState === 'singlestory') {
    smallbarClass = classes.InvisibleStoriesPage
    mediumbarClass = classes.InvisibleStoriesPage
    fullscreenClass = classes.InvisibleStoriesPage
    singlestoryClass = classes.StoriesPage
  }

  const handleArrowClick = o => {
    if (o === 'more') {
      if (classState === 'smallbar') {
        handleStoryStateChange('mediumbar')
      } else if (classState === 'mediumbar') {
        handleStoryStateChange('fullscreen')
      }
    } else {
      if (classState === 'fullscreen') {
        handleStoryStateChange('mediumbar')
      } else if (classState === 'mediumbar') {
        handleStoryStateChange('smallbar')
      } else if (classState === 'singlestory') {
        handleStoryStateChange('mediumbar')
      }
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000000,
        pointerEvents: 'none'
      }}
    >
      <Paper
        elevation={10}
        variant='outlined'
        style={DisplayStyle[String(classState)]}
        id='stories'
        onWheel={handleWheelEvent}
      >
        <div className={fullscreenClass}>
          <div
            style={{ paddingLeft: 100, width: '100%', DisplayStyle: 'inline' }}
          >
            <h2 style={{ DisplayStyle: 'inline' }}>{txt.Stories}</h2>
            {info.show !== true && (
              <p style={{ position: 'absolute', top: 7, left: 200 }}>
                {txt.StoriesExplanation}
              </p>
            )}
            {info.show === true && info.info.dataid === 'community' && (
              <p style={{ position: 'absolute', top: 7, left: 200 }}>
                Stories from {info.info.name}
                <img
                  width={20}
                  src={
                    images[
                      Communities[
                        Communities.findIndex(p => p.name === info.info.name)
                      ].type
                    ]
                  }
                />
              </p>
            )}
            {info.show === true &&
              (info.info.dataid === 'community' ||
                info.info.dataid === 'MapOMNIsIconlayer') && (
                  <p style={{ position: 'absolute', top: 7, left: 200 }}>
                Stories from {info.info.name}
              </p>
            )}
            <p style={{ position: 'absolute', top: 7, right: 20 }}>
              <IconButton>
                <ExpandMoreIcon onClick={() => handleArrowClick('less')} />
              </IconButton>
            </p>
            <p style={{ position: 'absolute', top: -20, right: 20 }}>
              <IconButton>
                <ExpandLessIcon onClick={() => handleArrowClick('more')} />
              </IconButton>
            </p>
            <Divider />
          </div>
          <br />
          <div className={classes.StoriesText}>
            <Grid
              container
              spacing={6}
              // style={{ textAlign: 'left' }}
            >
              <Grid item xs={12} sm={6}>
                <img
                  style={{ cursor: 'pointer' }}
                  className={classes.img}
                  src={FujiTv}
                  onClick={o => handleStoryStateChange('singlestory')}
                />
                <br />
                <div
                  style={{
                    marginLeft: '15%',
                    marginRight: '15%',
                    textAlign: 'left'
                  }}
                >
                  <br />
                  <Divider />
                  <Link
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStoryStateChange('singlestory')}
                  >
                    <h2>OMNI on Fuji TV</h2>
                  </Link>
                  <i>DLX Design Lab - 10/06/2020</i>
                  <p>
                    OMNI was featured on the future runners TV program on Fuji
                    TV! <br />
                    <br />
                  </p>
                  <Divider />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <img className={classes.img} src={ZushiWorkshop} />
                <br />
                <div
                  style={{
                    marginLeft: '15%',
                    marginRight: '15%',
                    textAlign: 'left'
                  }}
                >
                  <br />
                  <Divider />
                  <Link
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStoryStateChange('singlestory')}
                  >
                    <h2>OMNI Workshop</h2>
                  </Link>
                  <i>DLX Design Lab - 10/06/2020</i>
                  <p>
                    A workshop was held at Zushi high school to introduce OMNI
                    and ideate around novel ocean monitoring methods
                    <br />
                    <br />
                  </p>
                  <Divider />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <img className={classes.img} src={KamakuraMayor} />
                <br />
                <div
                  style={{
                    marginLeft: '15%',
                    marginRight: '15%',
                    textAlign: 'left'
                  }}
                >
                  <br />
                  <Divider />
                  <Link
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStoryStateChange('singlestory')}
                  >
                    <h2>OMNI meets the Mayor of Kamakura</h2>
                  </Link>
                  <i>DLX Design Lab - 10/06/2020</i>
                  <p>
                    OMNI met with the mayor of Kamakura to discuss how ocean
                    monitoring devices might be adopted by the community
                    <br />
                    <br />
                  </p>
                  <Divider />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <img className={classes.img} src={HamanakoTest} />
                <br />
                <div
                  style={{
                    marginLeft: '15%',
                    marginRight: '15%',
                    textAlign: 'left'
                  }}
                >
                  <br />
                  <Divider />
                  <Link
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStoryStateChange('singlestory')}
                  >
                    <h2>Hamanako test update</h2>
                  </Link>
                  <i>DLX Design Lab - 10/06/2020</i>
                  <p>
                    The 10 OMNIs in Hamanako lake have been taken out for
                    maintenance
                    <br />
                    <br />
                  </p>
                  <Divider />
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
        <div className={singlestoryClass}>
          <div
            style={{ paddingLeft: 100, width: '100%', DisplayStyle: 'inline' }}
          >
            <h2 style={{ DisplayStyle: 'inline' }}>{txt.Stories}</h2>
            <p style={{ position: 'absolute', top: 7, left: 200 }}>
              {txt.StoriesExplanation}
            </p>
            <p style={{ position: 'absolute', top: 7, right: 20 }}>
              <IconButton>
                <ExpandMoreIcon onClick={() => handleArrowClick('less')} />
              </IconButton>
            </p>
            <p style={{ position: 'absolute', top: -20, right: 20 }}>
              <IconButton>
                <ExpandLessIcon onClick={() => handleArrowClick('more')} />
              </IconButton>
            </p>
            <Divider />
          </div>
          <StoryPage onBackClick={() => handleStoryStateChange('fullscreen')} />
        </div>
        <div className={mediumbarClass}>
          <div
            style={{ paddingLeft: 100, width: '100%', DisplayStyle: 'inline' }}
          >
            <h2 style={{ DisplayStyle: 'inline' }}>{txt.Stories}</h2>
            {info.show !== true && (
              <p style={{ position: 'absolute', top: 7, left: 200 }}>
                {txt.StoriesExplanation}
              </p>
            )}
            {info.show === true && info.info.dataid === 'community' && (
              <p style={{ position: 'absolute', top: 5, left: 200 }}>
                Stories from {info.info.name}
                &nbsp;
                <img
                  width={20}
                  src={
                    images[
                      Communities[
                        Communities.findIndex(p => p.name === info.info.name)
                      ].type
                    ]
                  }
                />
              </p>
            )}
            {info.show === true &&
              (info.info.dataid === 'community' ||
                info.info.dataid === 'OMNI') && (
                  <p style={{ position: 'absolute', top: 11, left: 200 }}>
                Stories from {info.info.name}
              </p>
            )}
            <p style={{ position: 'absolute', top: 7, right: 20 }}>
              <IconButton>
                <ExpandMoreIcon onClick={() => handleArrowClick('less')} />
              </IconButton>
            </p>
            <p style={{ position: 'absolute', top: -20, right: 20 }}>
              <IconButton>
                <ExpandLessIcon onClick={() => handleArrowClick('more')} />
              </IconButton>
            </p>
            <Divider />
          </div>
          <br />
          <div className={classes.StoriesText}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
                <div
                  className={classes.imagehover}
                  onClick={() => handleStoryStateChange('singlestory')}
                >
                  <img className={classes.imagecss} src={FujiTv} />
                  <div className={classes.imageoverlay}>
                    <div className={classes.imagehovertext}>
                      OMNI on Fuji TV
                      <p style={{ fontSize: 'small' }}>
                        on 20/12/2019 <br /> by DLX Design Lab
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div className={classes.imagehover}>
                  <img className={classes.imagecss} src={ZushiWorkshop} />
                  <div className={classes.imageoverlay}>
                    <div className={classes.imagehovertext}>
                      Zushi Workshop
                      <p style={{ fontSize: 'small' }}>
                        on 20/12/2019 <br /> by DLX Design Lab
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div className={classes.imagehover}>
                  <img className={classes.imagecss} src={HamanakoTest} />
                  <div className={classes.imageoverlay}>
                    <div className={classes.imagehovertext}>
                      Hamanako Test
                      <p style={{ fontSize: 'small' }}>
                        on 20/12/2019 <br /> by DLX Design Lab
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
        <div
          className={smallbarClass}
          onClick={() => handleStoryStateChange('mediumbar')}
        >
          <div
            style={{ paddingLeft: 100, width: '100%', DisplayStyle: 'inline' }}
          >
            <h2 style={{ DisplayStyle: 'inline' }}>{txt.Stories}</h2>
            <p style={{ position: 'absolute', top: 7, left: 200 }}>
              Scroll up to see more! ☝️
            </p>
            <p style={{ position: 'absolute', top: 7, right: 20 }}>
              <IconButton>
                <ExpandMoreIcon onClick={() => handleArrowClick('less')} />
              </IconButton>
            </p>
            <p style={{ position: 'absolute', top: -20, right: 20 }}>
              <IconButton>
                <ExpandLessIcon onClick={() => handleArrowClick('more')} />
              </IconButton>
            </p>
            <Divider />
          </div>
          <div className={classes.StoriesText}>
            <p>
              Stories are how the OMNI community share their work, click or
              scroll here to see more!
            </p>
          </div>
        </div>
      </Paper>
    </div>
  )
}

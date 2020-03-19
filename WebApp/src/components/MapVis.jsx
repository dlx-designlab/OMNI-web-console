/* eslint-disable no-lone-blocks */
import { MapController } from '@deck.gl/core'
import { ArcLayer, IconLayer, ScatterplotLayer } from '@deck.gl/layers'
import DeckGL from '@deck.gl/react'
import React, { useCallback, useEffect, useState } from 'react'
import { FlyToInterpolator, StaticMap } from 'react-map-gl'

// import { HeatmapLayer } from '@deck.gl/aggregation-layers'
// import { TextLayer } from '@deck.gl/layers'
import Communities from './data/communities.json'
import introcommunities from './data/introcommunities.json'
import IconImageCommunity from './data/location-icon-atlas-community.png'
import IconImage from './data/location-icon-atlas.png'
import IconMapping from './data/location-icon-mapping.json'
import RedRingImg from './data/RedRing.png'
import IconClusterLayer from './icon-cluster-layer'

const Surfimg = require('./icons/Surfing.png')
const AquaCultureimg = require('./icons/AquaCulture.png')
const Universityimg = require('./icons/University.png')
const Fishingimg = require('./icons/Fishing.png')
const Shellfishimg = require('./icons/Shellfish.png')
const Schoolimg = require('./icons/School.png')
const Onlineimg = require('./icons/Online.png')
const Offlineimg = require('./icons/Offline.png')
const OMNIchanimg = require('./icons/OMNI.png')

const images = {
  Surf: Surfimg.default,
  AquaCulture: AquaCultureimg.default,
  University: Universityimg.default,
  Fishing: Fishingimg.default,
  Shellfish: Shellfishimg.default,
  School: Schoolimg.default,
  Online: Onlineimg.default,
  Offline: Offlineimg.default,
  OMNIchan: OMNIchanimg.default
}

var aliveOMNIs = []

export default function MapVis ({
  clusterState,
  communityState,
  omniState,
  data,
  omniplotdata,
  viewState,
  onViewStateChange,
  onLayerClick,
  chapterState,
  info,
  omniPoint
}) {
  const handleLayerClick = useCallback(
    info => {
      if (info.object && info.object.cluster) {
        const newviewstate = {
          longitude: info.coordinate[0],
          latitude: info.coordinate[1],
          zoom: viewState.zoom + 1,
          pitch: 0,
          bearing: 0,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator()
        }
        onViewStateChange(newviewstate, 'map')
      } else if (info.object) {
        setOmniTooltipState(false)
        onLayerClick(info.object)
        const newviewstate = {
          longitude: info.coordinate[0],
          latitude: info.coordinate[1],
          zoom: viewState.zoom,
          pitch: 0,
          bearing: 0,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator()
        }
        onViewStateChange(newviewstate, 'map')
      }
    },
    [
      data,
      omniplotdata,
      viewState,
      onViewStateChange,
      onLayerClick,
      chapterState,
      info
    ]
  )

  const [omniTooltipState, setOmniTooltipState] = useState({
    object: false,
    x: 0,
    y: 0
  })

  function omniTooltip () {
    if (omniTooltipState.object) {
      if (
        omniTooltipState.id === 'MapOMNIs' ||
        omniTooltipState.id === 'MapOMNIsIconLayer' ||
        omniTooltipState.id === 'MapOMNIsIconClusterLayer' ||
        omniTooltipState.id === 'MapOMNIsIconLayerCommunity'
      ) {
        if (omniTooltipState.object.cluster) {
          return (
            <div
              style={{
                fontSize: 'small',
                alignContent: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                position: 'absolute',
                zIndex: 1000,
                pointerEvents: 'none',
                left: omniTooltipState.x + 15,
                top: omniTooltipState.y - 15
              }}
            >
              {omniTooltipState.object.point_count} OMNIs
            </div>
          )
        } else {
          return (
            <div
              style={{
                fontSize: 'small',
                alignContent: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                position: 'absolute',
                zIndex: 1000,
                pointerEvents: 'none',
                left: omniTooltipState.x + 15,
                top: omniTooltipState.y - 15
              }}
            >
              {omniTooltipState.object.name}
              <br />
              Last online: {omniTooltipState.object.lastonline}
              <br />
              Water Temperature:{' '}
              {omniTooltipState.object.temperature.toFixed([2])} °C
              <br />
              Salinity: {omniTooltipState.object.salinity.toFixed([0])} µS/cm
            </div>
          )
        }
      } else if (
        omniTooltipState.id === 'MapCommunitiesIconClusterLayer' ||
        omniTooltipState.id === 'MapCommunitiesIconLayer' ||
        omniTooltipState.id === 'MapcommunitiesSingleIcon'
      ) {
        if (omniTooltipState.object.cluster) {
          return (
            <div
              style={{
                fontSize: 'small',
                alignContent: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                position: 'absolute',
                zIndex: 1000,
                pointerEvents: 'none',
                left: omniTooltipState.x + 15,
                top: omniTooltipState.y - 15
              }}
            >
              <img
                style={{ verticalAlign: 'middle' }}
                src={images[omniTooltipState.object.type]}
              />{' '}
              {omniTooltipState.object.point_count} Communities
            </div>
          )
        } else {
          return (
            <div
              style={{
                fontSize: 'small',
                alignContent: 'center',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                position: 'absolute',
                zIndex: 1000,
                pointerEvents: 'none',
                left: omniTooltipState.x + 15,
                top: omniTooltipState.y - 15
              }}
            >
              <img
                style={{ verticalAlign: 'middle' }}
                src={images[omniTooltipState.object.type]}
              />{' '}
              {omniTooltipState.object.name}
            </div>
          )
        }
      }
    } else {
      return null
    }
  }

  const handleCursor = o => {
    if (omniTooltipState.object) {
      return 'pointer'
    } else if (o.isDragging) {
      return 'grabbing'
    } else {
      return 'grab'
    }
  }

  const [runAnimation, setRunAnimation] = useState(true)
  const [transitionDuration, setTransitionDuration] = useState(1)

  const handleViewStateChange = useCallback(
    ({ viewState }) => {
      if (onViewStateChange != null) {
        onViewStateChange(viewState, 'map')
      }
    },
    [onViewStateChange]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setRunAnimation(!runAnimation)
      runAnimation ? setTransitionDuration(1) : setTransitionDuration(1000)
      if (info && info.info.dataid === 'community') {
        aliveOMNIs = omniplotdata.filter(
          o =>
            o.online === 1 && info.info.OMNIs.map(d => d.name).includes(o.name)
        )
      } else {
        aliveOMNIs = omniplotdata.filter(o => o.online === 1)
      }
    }, transitionDuration)
    return () => {
      clearInterval(timer)
    }
  }, [runAnimation])

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={handleViewStateChange}
      controller={{ type: MapController }}
      onClick={info => handleLayerClick(info)}
      getCursor={o => handleCursor(o)}
    >
      <StaticMap
        mapStyle='mapbox://styles/grahamtakram/ck4jp714k0vcs1crpucfd9qf0'
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
      />
      {/* {communityState && clusterState && info && info.show !== true &&
        <IconClusterLayer
          id='MapCommunitiesIconClusterLayer'
          autoHighlight
          data={Communities}
          iconMapping={IconMapping}
          iconAtlas={IconImageCommunity}
          sizeScale={50}
          getSize={40}
          getPosition={o => [o.longitude, o.latitude]}
          getIcon={d => 'marker'}
          pickable
          onClick={(info) => handleLayerClick(info)}
          onHover={info => setOmniTooltipState({
            id: info.layer.id,
            object: info.object,
            x: info.x,
            y: info.y
          })}
        />} */}
      {communityState && info && info.show !== true && (
        <IconLayer
          id='MapCommunitiesIconLayer'
          autoHighlight
          data={Communities}
          iconMapping={IconMapping}
          iconAtlas={IconImageCommunity}
          sizeScale={6}
          getSize={7}
          getPosition={o => [o.longitude, o.latitude]}
          getIcon={d => 'marker'}
          pickable
          onClick={info => handleLayerClick(info)}
          onHover={info =>
            setOmniTooltipState({
              id: info.layer.id,
              object: info.object,
              x: info.x,
              y: info.y
            })}
        />
      )}
      {omniState && clusterState && info && info.show !== true && (
        <IconClusterLayer
          id='MapOMNIsIconClusterLayer'
          autoHighlight
          data={omniplotdata}
          iconMapping={IconMapping}
          iconAtlas={IconImage}
          sizeScale={40}
          getSize={30}
          getPosition={o => [o.longitude, o.latitude]}
          getIcon={d => 'marker'}
          pickable
          onClick={info => handleLayerClick(info)}
          onHover={info => {
            setOmniTooltipState({
              id: info.layer.id,
              object: info.object,
              x: info.x,
              y: info.y
            })
          }}
        />
      )}
      {omniState && !clusterState && info && info.show !== true && (
        <IconLayer
          id='MapOMNIsIconLayer'
          autoHighlight
          data={omniplotdata}
          iconMapping={IconMapping}
          iconAtlas={IconImage}
          sizeScale={5}
          getSize={5}
          getPosition={o => [o.longitude, o.latitude]}
          getIcon={d => 'marker'}
          pickable
          onClick={info => handleLayerClick(info)}
          onHover={info => {
            setOmniTooltipState({
              id: info.layer.id,
              object: info.object,
              x: info.x,
              y: info.y
            })
          }}
        />
      )}
      {info &&
        info.show === true &&
        (info.info.dataid === 'OMNI' || info.info.dataid === 'OMNI') && (
          <ScatterplotLayer
          id='MapOMNIssingle'
          autoHighlight
          data={[omniPoint]}
          getPosition={o => [o.longitude, o.latitude]}
          radiusScale={5}
          radiusMinPixels={5}
          radiusMaxPixels={100}
          opactiy={1}
          getFillColor={() => [0 * 200, 0, 0]}
          pickable
          onClick={info => handleLayerClick(info)}
        />
      )}
      {info && info.show === true && info.info.dataid === 'community' && (
        <IconLayer
          id='MapOMNIsIconLayerCommunity'
          autoHighlight
          data={omniplotdata.filter(o =>
            info.info.OMNIs.map(d => d.name).includes(o.name)
          )}
          iconMapping={IconMapping}
          iconAtlas={IconImage}
          sizeScale={5}
          getSize={5}
          getPosition={o => [o.longitude, o.latitude]}
          getIcon={d => 'marker'}
          pickable
          onClick={info => handleLayerClick(info)}
          onHover={info => {
            setOmniTooltipState({
              id: info.layer.id,
              object: info.object,
              x: info.x,
              y: info.y
            })
          }}
        />
      )}
      {info && info.show === true && info.info.dataid === 'community' && (
        <IconLayer
          id='MapcommunitiesSingleIcon'
          autoHighlight
          data={[info.info]}
          iconMapping={IconMapping}
          iconAtlas={IconImageCommunity}
          sizeScale={6}
          getSize={7}
          getPosition={o => [o.longitude, o.latitude]}
          getIcon={d => 'marker'}
          pickable
          onClick={info => handleLayerClick(info)}
          onHover={info =>
            setOmniTooltipState({
              id: info.layer.id,
              object: info.object,
              x: info.x,
              y: info.y
            })}
        />
      )}
      {/* {info && info.show === true && info.info.dataid === 'community' &&
        <IconLayer
          id='MapcommunitiesSingleIcon'
          autoHighlight
          data={[info.info]}
          getSize={50}
          getPosition={o => [o.longitude, o.latitude]}
          getIcon={d => ({
            url: images[String(d.type)],
            width: 25,
            height: 25
          })}
          pickable
          onClick={(info) => handleLayerClick(info)}
          onHover={info => {
            setOmniTooltipState({
              id: info.layer.id,
              object: info.object,
              x: info.x,
              y: info.y
            })
          }}
        />} */}
      {/* {!clusterState && omniState && info && info.show === false && runAnimation &&
        <ScatterplotLayer // use icon layer
          data={omniplotdata.filter(o => o.online === 1)}
          getPosition={o => [o.longitude, o.latitude]}
          opactiy={1}
          getFillColor={[255, 0, 0, 0]}
          getLineColor={runAnimation ? [255, 0, 0, 0] : [255, 0, 0, 255]}
          // getLineColor={[255, 0, 0, 255]}
          lineWidthMinPixels={2}
          stroked
          radiusMinPixels={1}
          radiusMaxPixels={20}
          radiusScale={runAnimation ? 100000000000 : 1000}
          // updateTriggers={{ radiusScale: runAnimation, getLineColor: runAnimation }}
          // onTransitionEnd={() => setRunAnimation(!runAnimation)}
          transitions={{
            radiusScale: {
              duration: 900,
              // easing: t => t,
              enter: () => 1000
              // onEnd:
            },
            getLineColor: {
              duration: 900,
              // easing: t => t,
              enter: () => [255, 0, 0, 255]
            }
          }}
        />} */}
      {/* {!clusterState && info && info.show === true && runAnimation && info.info.dataid === 'community' &&
        <ScatterplotLayer
          data={omniplotdata.filter(o => o.online === 1 && info.info.OMNIs.map(d => d.name).includes(o.name))}
          getPosition={o => [o.longitude, o.latitude]}
          opactiy={1}
          getFillColor={[255, 0, 0, 0]}
          getLineColor={runAnimation ? [255, 0, 0, 0] : [255, 0, 0, 255]}
          // getLineColor={[255, 0, 0, 255]}
          lineWidthMinPixels={2}
          stroked
          radiusMinPixels={1}
          radiusMaxPixels={20}
          radiusScale={runAnimation ? 100000000000 : 1000}
          updateTriggers={{ radiusScale: runAnimation, getLineColor: runAnimation }}
          // onTransitionEnd={() => setRunAnimation(!runAnimation)}
          transitions={{
            radiusScale: {
              duration: transitionDuration,
              // easing: t => t,
              enter: () => 1000
            },
            getLineColor: {
              duration: transitionDuration,
              // easing: t => t,
              enter: () => [255, 0, 0, 255]
            }
          }}
        />} */}
      {!clusterState && omniState && info && info.show === false && (
        <IconLayer
          id='IconAnimation'
          data={aliveOMNIs}
          getSize={runAnimation ? 1 : 80}
          getPosition={o => [o.longitude, o.latitude]}
          getColor={runAnimation ? [0, 0, 0, 255] : [0, 0, 0, 50]}
          getIcon={d => ({
            url: RedRingImg,
            width: 500,
            height: 500
          })}
          transitions={{
            getSize: {
              duration: transitionDuration,
              easing: t => t * t
            },
            getColor: {
              duration: transitionDuration,
              easing: t => t * t,
              enter: () => [0, 0, 0, 0]
            }
          }}
        />
      )}
      {!clusterState && omniState && info && info.info.dataid === 'community' && (
        <IconLayer
          id='IconAnimation'
          data={aliveOMNIs}
          getSize={runAnimation ? 1 : 80}
          getPosition={o => [o.longitude, o.latitude]}
          getColor={runAnimation ? [0, 0, 0, 255] : [0, 0, 0, 50]}
          getIcon={d => ({
            url: RedRingImg,
            width: 500,
            height: 500
          })}
          transitions={{
            getSize: {
              duration: transitionDuration,
              easing: t => t * t
            },
            getColor: {
              duration: transitionDuration,
              easing: t => t * t,
              enter: () => [0, 0, 0, 0]
            }
          }}
        />
      )}
      {/* {chapterState.mode === 'OMNIs' && <ScatterplotLayer
        data={Communities}
        getPosition={o => [o.longitude, o.latitude]}
        radiusScale={5000 - (330 * viewState.zoom)}
        opactiy={1}
        getFillColor={[0, 255, 0]}
        pickable
        onClick={(info) => handleLayerClick(info)}
      />}
      {/* <HeatmapLayer
        data={omniplotdata.filter(o => !isNaN(o.latitude))}
        id='heatmp-layer'
        pickable={false}
        getPosition={o => [o.longitude, o.latitude]}
        getWeight={o => [o.temperature]}
        radiusPixels={60}
        intensity={1}
        threshold={0.03}
      /> */}
      {/* {// chapterState && chapterState.mode === 'community' &&
        <ScatterplotLayer
          id='Mapcommunities'
          data={Communities}
          getPosition={o => [o.longitude, o.latitude]}
          radiusScale={5}
          radiusMinPixels={5}
          radiusMaxPixels={15}
          getFillColor={o => [20, 0, 150, 100]}
          pickable
          getRadius={() => 20000000}
          onClick={(info) => handleLayerClick(info)}
          onHover={info => {
            setOmniTooltipState({
              id: info.layer.id,
              object: info.object,
              x: info.x,
              y: info.y
            })
          }}
        />
      } */}
      {/* {chapterState && chapterState.mode === 'community' &&
        <TextLayer
          id='text-layer'
          data={omniplotdata}
          getPosition={o => [o.longitude, o.latitude]}
          getText={o => o.name}
          getSize={30}
          getTextAnchor='middle'
          sizeMinPixels={10}
          sizeMaxPixels={20}
          getAlignmentBaseline='center'
          getPixelOffset={[0, 30]}
          getColor={[0, 0, 0, 255.0119 + (1.25822e-14 - 255.0119) / (1 + Math.pow(viewState.zoom / 10.39277, 27.18879))]}
        />} */}
      {/* {chapterState && chapterState.mode === 'community' &&
        <TextLayer
          id='text-layer-online'
          data={omniplotdata}
          getPosition={o => [o.longitude, o.latitude]}
          getText={o => String(['Last online ' + String(o.lastonline) + ' ago'])}
          getSize={30}
          getTextAnchor='middle'
          sizeMinPixels={10}
          sizeMaxPixels={20}
          getAlignmentBaseline='center'
          getPixelOffset={[0, -30]}
          getColor={[0, 0, 0, 255.0119 + (1.25822e-14 - 255.0119) / (1 + Math.pow(viewState.zoom / 10.39277, 27.18879))]}
        />} */}
      {/* {// chapterState && chapterState.mode === 'community' &&
        <ScatterplotLayer
          id='MapOMNIs'
          data={omniplotdata}
          getPosition={o => [o.longitude, o.latitude]}
          radiusScale={5}
          radiusMinPixels={5}
          radiusMaxPixels={15}
          getFillColor={o => {
            if (o.online) {
              return [200, 0, 0, 100]
            } else {
              return [100, 100, 100, 100]
            }
          }}
          getRadius={() => 100000000}
          stroked
          lineWidthMinPixels={1}
          // transitions={{
          //  getRadius: {
          //    duration: 10000,
          //    enter: t => [t[0] * 0.1]
          //  }
          // }}
          pickable
          onClick={(info) => handleLayerClick(info)}
          onHover={info => setOmniTooltipState({
            id: info.layer.id,
            object: info.object,
            x: info.x,
            y: info.y
          })}
        />
      } */}
      {/* <IconLayer
        id='MapOMNIsIconlayer'
        data={omniplotdata}
        getSize={50}
        getPosition={o => [o.longitude, o.latitude]}
        getIcon={d => ({
          url: images.OMNIchan,
          width: 25,
          height: 25
        })}
        pickable
        // onClick={(info) => handleLayerClick(info)}
      /> */}

      {/* //////////////////////////////////////////////////////////////
      // Intro
      //////////// */}

      {chapterState && chapterState === 'Data' && (
        <ArcLayer
          id='arc-layerintro'
          data={introcommunities}
          getWidth={2}
          getSourcePosition={o => o.location}
          getTargetPosition={o => o.omnilocation}
          getTilt={d => 0}
          transitions={{
            getSourceColor: {
              duration: 1000
            },
            getTargetColor: {
              duration: 1000
            }
          }}
        />
      )}
      {chapterState && chapterState === 'Overview' && (
        <IconLayer
          id='MapOMNIsIconLayerintro'
          data={introcommunities}
          iconMapping={IconMapping}
          iconAtlas={IconImage}
          sizeScale={5}
          getSize={5}
          getPosition={o => o.omnilocation}
          getIcon={d => 'marker'}
          transitions={{
            getColor: {
              duration: 1000
            }
          }}
        />
      )}
      {chapterState &&
        (chapterState === 'Overview') | (chapterState === 'Communities') && (
          <IconLayer
          id='MapCommunitiesIconLayerinto'
          data={Communities}
          iconMapping={IconMapping}
          iconAtlas={IconImageCommunity}
          sizeScale={6}
          getSize={7}
          getPosition={o => [o.longitude, o.latitude]}
          getIcon={d => 'marker'}
          transitions={{
            getColor: {
              duration: 1000
            }
            }}
        />
      )}
      {/* {chapterState && (chapterState === 'Overview' | chapterState === 'OMNIs') &&
        <IconLayer
          id='IconAnimationinto'
          data={omniplotdata}
          getSize={runAnimation ? 1 : 80}
          getPosition={o => [o.longitude, o.latitude]}
          getColor={runAnimation ? [0, 0, 0, 255] : [0, 0, 0, 50]}
          getIcon={d => ({
            url: RedRingImg,
            width: 500,
            height: 500
          })}
          transitions={{
            getSize: {
              duration: transitionDuration,
              easing: t => t * t
            },
            getColor: {
              duration: transitionDuration,
              easing: t => t * t,
              enter: () => [0, 0, 0, 0]
            }
          }}
        />} */}
      {chapterState && (chapterState === 'Data') | (chapterState === 'OMNIs') && (
        <IconLayer
          id='MapOMNIsIconLayerintro1'
          data={introcommunities}
          iconMapping={IconMapping}
          iconAtlas={IconImage}
          sizeScale={5}
          getSize={5}
          getPosition={o => o.omnilocation}
          getIcon={d => 'marker'}
          transitions={{
            getColor: {
              duration: 1000
            }
          }}
        />
      )}
      {chapterState && chapterState.mode === 'communityconnections' && (
        <IconLayer
          id='Mapcommunities'
          data={introcommunities}
          getSize={50}
          getPosition={o => o.location}
          getIcon={d => ({
            url: images.Surf,
            width: 25,
            height: 25
          })}
          pickable
          onClick={info => handleLayerClick(info)}
        />
      )}
      {chapterState &&
        chapterState.mode === 'All Icons' &&
        omniplotdata.length !== 0 && (
          <IconLayer
          id='MapOMNIs'
          data={omniplotdata}
          getSize={50}
          getPosition={a => [a.longitude, a.latitude]}
          getIcon={d => ({
            url: images[String(d.online)],
            width: 25,
            height: 25
          })}
          pickable
          onClick={info => handleLayerClick(info)}
        />
      )}
      {chapterState && chapterState.mode === 'All Icons' && (
        <IconLayer
          id='Mapcommunities'
          data={Communities}
          getSize={50}
          getPosition={o => [o.longitude, o.latitude]}
          getIcon={d => ({
            url: images[String(d.type)],
            width: 25,
            height: 25
          })}
          pickable
          onClick={info => handleLayerClick(info)}
        />
      )}
      {omniTooltipState.object && omniTooltip}
    </DeckGL>
  )
}

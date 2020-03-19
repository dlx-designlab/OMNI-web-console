import moment from 'moment'
import React from 'react'
import { Brush, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'

import classes from './App.scss'

const units = {
  temperature1: '°C',
  temperature2: '°C',
  temperature3: 'µS/cm'
}

export default function DataGraph ({
  plotdata,
  datatype,
  onGraphInteract,
  brushState,
  handleBrushStateChange
}) {
  var plot = []

  if (typeof plotdata.messages !== 'undefined') {
    for (var i = 0; i < plotdata.messages.length; i++) {
      plot[i] = {
        x: +new Date(plotdata.messages[plotdata.messages.length - i - 1].date),
        y: Number(
          plotdata.messages[plotdata.messages.length - i - 1].data[datatype]
        ),
        latitude: Number(
          plotdata.messages[plotdata.messages.length - i - 1].data.latitude
        ),
        longitude: Number(
          plotdata.messages[plotdata.messages.length - i - 1].data.longitude
        )
      }
    }
    plot[plotdata.messages.length] = {
      x: +new Date(),
      y: Number(plotdata.messages[0].data[datatype]),
      latitude: Number(plotdata.messages[0].data.latitude),
      longitude: Number(plotdata.messages[0].data.longitude)
    }
    if (brushState.length === 0) {
      handleBrushStateChange([
        3 * Math.floor((plot.length - 1) / 4),
        plot.length - 1
      ])
    }
  }

  if (plot[plot.length - 1]) {
    onGraphInteract(plot[plot.length - 1], 'graph')
  }

  const CustomTooltip = ({ active, payload, label }) => {
    var tooltipvalue = 'N/A'
    if (active) {
      if (
        payload &&
        payload[0] &&
        typeof payload[0] !== 'undefined' &&
        plot.length !== 0
      ) {
        const location = {
          longitude: payload[0].payload.longitude,
          latitude: payload[0].payload.latitude
        }
        tooltipvalue = payload[0].value
        onGraphInteract(location, 'graph')
      }
      return (
        <Paper elevation={5}>
          <div className={classes.customtooltip}>
            {tooltipvalue} {units[datatype]}
            <br />
            <div className={classes.tooltiptime}>
              {moment(label).format('YYYY/M/D HH:mm')}
            </div>
          </div>
        </Paper>
      )
    }

    return null
  }

  const linecolor = {
    temperature1: 'rgba(80,194,247,1)',
    temperature2: 'rgba(33,209,143,1)',
    temperature3: 'rgba(255,166,0,1)'
  }

  const getLineColor = () => {
    return linecolor[datatype]
  }

  var timerID = 0

  const handleChange = o => {
    if (timerID !== 0) {
      clearTimeout(timerID)
    }
    timerID = setTimeout(() => {
      handleBrushStateChange([o.startIndex, o.endIndex])
    }, 500)
  }

  return (
    <div>
      {plot.length < 1 && (
        <div style={{ position: 'absolute', left: '50%', top: '-150px' }}>
          <CircularProgress />
        </div>
      )}
      {plot.length > 1 && (
        <LineChart
          width={window.innerWidth * 0.75}
          height={250}
          data={plot}
          margin={{ top: 5, right: 40, bottom: 0, left: 0 }}
        >
          <Line
            type='monotone'
            dataKey='y'
            stroke={getLineColor()}
            dot={false}
            strokeWidth={2}
          />
          <XAxis
            dataKey='x'
            scale='time'
            type='number'
            domain={['dataMin', 'dataMax']}
            tickFormatter={unixTime => moment(unixTime).format('MMM Do')}
            tickCount={10}
          />
          <YAxis dataKey='y' />
          <Tooltip content={<CustomTooltip />} />
          <Brush
            dataKey='x'
            height={20}
            gap={5}
            travellerWidth={5}
            startIndex={brushState[0]}
            endIndex={brushState[1]}
            tickFormatter={() => ''}
            onChange={handleChange}
          >
            <LineChart data={plot}>
              <Line
                type='monotone'
                dataKey='y'
                stroke={getLineColor()}
                dot={false}
              />
            </LineChart>
          </Brush>
        </LineChart>
      )}
    </div>
  )
}

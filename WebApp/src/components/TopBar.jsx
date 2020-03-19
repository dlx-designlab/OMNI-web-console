// import { LineLayer } from '@deck.gl/layers'
import React, { useCallback } from 'react'

import { Box } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TextField from '@material-ui/core/textField'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import CallMergeIcon from '@material-ui/icons/CallMerge'
import CodeIcon from '@material-ui/icons/Code'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import InfoIcon from '@material-ui/icons/Info'
import LanguageIcon from '@material-ui/icons/Language'
import MapIcon from '@material-ui/icons/Map'
import TodayIcon from '@material-ui/icons/Today'
import Autocomplete from '@material-ui/lab/Autocomplete'

import Communities from './data/communities.json'
import OMNI from './icons/OMNI.png'

import classes from './App.scss'

var content = []

export default function TopBar ({
  onClick,
  omniplotdata,
  onSearch,
  onLanguageChange
}) {
  const handleChange = o => {
    onSearch(o)
  }

  const handleKeyPress = o => {
    if (o.key === 'Enter') {
      handleChange(content.filter(a => a.index === o.target.value))
    }
  }

  function updatecontent (omniplotdata) {
    var content = []
    var sortedomniplotdata = []
    for (var i = 0; i < Communities.length; i++) {
      content.push({
        index: Communities[i].name,
        image: Communities[i].type,
        searchtype: 'Community'
      })
    }
    if (omniplotdata.length !== 0) {
      sortedomniplotdata = omniplotdata.sort((a, b) =>
        a.online > b.online ? -1 : 1
      )
    }
    for (var j = 0; j < sortedomniplotdata.length; j++) {
      content.push({
        index: sortedomniplotdata[j].name,
        image: sortedomniplotdata[j].online,
        searchtype: 'OMNI'
      })
    }
    return content
  }
  if (omniplotdata) {
    content = updatecontent(omniplotdata)
  } else {
    content = []
  }
  const options = content.map(option => {
    const firstLetter = option.index[0].toUpperCase()
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option
    }
  })

  const handleClick = useCallback(
    (event, newValue) => {
      if (onClick != null) {
        onClick(newValue)
        setValue(newValue)
      }
    },
    [onClick]
  )

  const [value, setValue] = React.useState('Home')

  const getClassName = () => {
    if (value === 'Home') {
      return classes.SearchBarVisible
    } else {
      return classes.SearchBarInvisible
    }
  }

  const handleLanguageChange = () => {
    onLanguageChange()
  }

  return (
    <div>
      <AppBar
        position='static'
        style={{ color: 'black', backgroundColor: '#BBE6FF' }}
      >
        <Box display='flex'>
          <Toolbar>
            <img src={OMNI} width={35} />
            &nbsp; &nbsp;
            <h2> OMNI </h2>
            &nbsp; &nbsp; &nbsp; &nbsp;
            {/* <Divider orientation='vertical' variant='middle' /> */}
          </Toolbar>
          <Tabs
            orientation='horizontal'
            variant='standard'
            value={value}
            onChange={handleClick}
            aria-label='Horizontal tabs'
            style={{ paddingTop: 10 }}
          >
            <Tooltip value='Home' title='Home' placement='bottom'>
              <Tab
                style={{ minWidth: 60 }}
                icon={<MapIcon />}
                aria-label='Home'
                value='Home'
              />
            </Tooltip>
            <Tooltip value='About' title='About' placement='bottom'>
              <Tab
                style={{ minWidth: 60 }}
                icon={<InfoIcon />}
                aria-label='About'
                value='About'
              />
            </Tooltip>
            <Tooltip value='Join' title='Join' placement='bottom'>
              <Tab
                style={{ minWidth: 60 }}
                icon={<CallMergeIcon />}
                aria-label='Join'
                value='Join'
              />
            </Tooltip>
            <Tooltip value='API' title='API' placement='bottom'>
              <Tab
                style={{ minWidth: 60 }}
                icon={<CodeIcon />}
                aria-label='API'
                value='API'
              />
            </Tooltip>
            <Tooltip value='Events' title='Events' placement='bottom'>
              <Tab
                style={{ minWidth: 60 }}
                icon={<TodayIcon />}
                aria-label='Events'
                value='Events'
              />
            </Tooltip>
          </Tabs>
          &nbsp; &nbsp; &nbsp; &nbsp;
          {/* <Divider orientation='vertical' variant='middle' flexItem='true' /> */}
          <div className={getClassName()} style={{ paddingTop: 13 }}>
            <Autocomplete
              onKeyPress={o => handleKeyPress(o)}
              id='grouped-search'
              options={options.sort(
                (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
              )}
              groupBy={option => option.searchtype}
              getOptionLabel={option => option.index}
              style={{ width: 250 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Search the OMNI world!'
                  variant='outlined'
                  fullWidth
                  size='small'
                />
              )}
            />
          </div>
          {/* <Divider orientation='vertical' variant='middle' flexItem='true' /> */}
          <Box flexGrow={1} />
        </Box>
        <div style={{ position: 'absolute', top: 20, right: 15 }}>
          <Tooltip
            value='Language'
            title='Change Language'
            placement='bottom'
            style={{}}
          >
            <LanguageIcon onClick={handleLanguageChange} />
          </Tooltip>
          &nbsp; &nbsp;
          <Tooltip value='Take a Tour' title='Take a Tour' placement='bottom'>
            <ExitToAppIcon onClick={() => handleClick([], 'Tour')} />
          </Tooltip>
        </div>
      </AppBar>
    </div>
  )
}

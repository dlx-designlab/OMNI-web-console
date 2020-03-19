import React from 'react'

import { Checkbox, Paper, Tooltip } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import { withStyles } from '@material-ui/core/styles'
// import FormHelperText from '@material-ui/core/FormHelperText'
import Switch from '@material-ui/core/Switch'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'

import classes from './App.scss'

const CommunitySwitch = withStyles(theme => ({
  root: {
    width: 40,
    height: 20,
    padding: 0,
    margin: 5,
    textAlign: 'right',
    alignItems: 'right',
    justifyContent: 'right'
  },
  switchBase: {
    padding: 0,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: 'rgb(0, 85, 166)',
        opacity: 1,
        border: 'none'
      }
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff'
    }
  },
  thumb: {
    width: 20,
    height: 20
  },
  track: {
    borderRadius: 20 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border'])
  },
  checked: {},
  focusVisible: {}
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      {...props}
    />
  )
})

const OmniSwitch = withStyles(theme => ({
  root: {
    width: 40,
    height: 20,
    padding: 0,
    margin: 5,
    textAlign: 'right',
    alignItems: 'right',
    justifyContent: 'right'
  },
  switchBase: {
    padding: 0,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: 'rgb(230, 230, 100)',
        opacity: 1,
        border: 'none'
      }
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff'
    }
  },
  thumb: {
    width: 20,
    height: 20
  },
  track: {
    borderRadius: 20 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border'])
  },
  checked: {},
  focusVisible: {}
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      {...props}
    />
  )
})

export default function LayerSelect ({
  clusterState,
  communityState,
  omniState,
  onClusterClick,
  onCommunityClick,
  onOmniClick
}) {
  const handleClusterClick = () => {
    onClusterClick()
  }

  const handleCommunityClick = () => {
    onCommunityClick()
  }

  const handleOmniClick = () => {
    onOmniClick()
  }

  return (
    <Paper elevation={5} className={classes.LayerSelect}>
      <FormControl>
        {/* <FormLabel style={{ fontSize: 'small' }} component='legend'>Layers</FormLabel> */}
        <FormGroup>
          <Tooltip placement='left' title='Communities'>
            <CommunitySwitch
              checked={communityState}
              onChange={handleCommunityClick}
              value='Communities'
              icon={
                <PeopleAltIcon style={{ color: 'grey' }} fontSize='small' />
              }
              checkedIcon={<PeopleAltIcon fontSize='small' />}
            />
          </Tooltip>
          <Tooltip placement='left' title='OMNIs'>
            <OmniSwitch
              checked={omniState}
              onChange={handleOmniClick}
              value='OMNIs'
              icon={
                <FiberManualRecordIcon
                  style={{ color: 'grey' }}
                  fontSize='small'
                />
              }
              checkedIcon={
                <FiberManualRecordIcon
                  style={{ color: 'white' }}
                  fontSize='small'
                />
              }
            />
          </Tooltip>
          {/* <Tooltip placement='left' title='Cluster'>
            <ClusterSwitch checked={clusterState} onChange={handleClusterClick} value='Cluster' />
          </Tooltip> */}
          <Tooltip placement='left' title='Cluster'>
            <Checkbox
              style={{ color: 'black' }}
              size='small'
              checked={clusterState}
              onChange={handleClusterClick}
              value='Cluster'
            />
          </Tooltip>
        </FormGroup>
      </FormControl>
    </Paper>
  )
}

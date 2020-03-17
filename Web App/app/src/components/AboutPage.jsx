import React from 'react'

import classes from './App.scss'

export default function AboutPage () {
  return (
    <div className={classes.aboutpagetext}>
      <object
        type='text/html'
        data='https://www.designlab.ac/omni-home'
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  )
}

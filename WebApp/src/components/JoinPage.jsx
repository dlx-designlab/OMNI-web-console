import React from 'react'

import classes from './App.scss'

export default function JoinPage () {
  return (
    <div className={classes.apipagetext}>
      <h1>Join</h1>
      <p>If you are interested in joining OMNI here are 3 easy ways.</p>
      <br />
      <h2>Download the Data and create a story</h2>
      <p>
        The OMNI platform is full of open source data. Using the API this free
        data can be used for anything, why not create something and share your
        work with the OMNI community through a story?
      </p>
      <br />

      <h2>Join or create an OMNI event in your community</h2>
      <p>
        There are loads of events happening in the OMNI world, why not join one
        or create one for your local area!
      </p>
      <br />

      <h2>Build and OMNI and start sensing your own data!</h2>
      <p>
        Designs for OMNI bouys are all open source and freely available. Check
        the hackaday and github repositories to see what is available.
      </p>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles({
  login: {
    background: 'white',
    height: '100vh',
    padding: '0 0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    zIndex: 2,
  },
  login__heading: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
})

export default function Login(props) {
  const classes = useStyles()
  const [showLogin, setShowLogin] = useState(true)

  useEffect(() => {
    if (props.apiReady) {
      setTimeout(() => setShowLogin(false), 1000)
    }
  }, [props.apiReady])

  return (
    <Box
      className={classes.login}
      data-loading
      style={{ display: showLogin ? 'flex' : 'none' }}>
      <Typography
        className={classes.login__heading}
        variant="h5"
        component="h2">
        Conversion Time
      </Typography>
      <Box className="g-signin2" data-onsuccess="ctLogin"></Box>
    </Box>
  )
}

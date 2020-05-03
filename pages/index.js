import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'

import Login from '../components/login'
import Account from '../components/account'
import Reccos from '../components/reccos'

const useStyles = makeStyles({
  root: {
    fontFamily: 'Roboto',
    padding: '40px 0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default function Home() {
  const [apiReady, setApiReady] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    window.ctLogin = () => {
      setTimeout(() => {
        setApiReady(true)
      }, 500)
    }
  }, [])

  return (
    <Box>
      <Login apiReady={apiReady} />
      <Container className={classes.root} maxWidth="lg">
        <Account apiReady={apiReady}>
          <Reccos />
        </Account>
      </Container>
    </Box>
  )
}

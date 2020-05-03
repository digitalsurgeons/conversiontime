import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

const useStyles = makeStyles({
  account: {
    textAlign: 'center',
  },
  account__heading: {
    marginBottom: 20,
  },
  account__form: {
    marginTop: 20,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    ['@media (min-width:1080px)']: {
      flexWrap: 'nowrap',
    },
  },
  account__select: {
    margin: 20,
    width: '100%',
    minWidth: 'none',
    textAlign: 'center',
    ['@media (min-width:768px)']: {
      margin: '0 20px',
      width: 'calc(50% - 40px)',
    },
    ['@media (min-width:1080px)']: {
      minWidth: 200,
      width: 'auto',
    },
    ['@media (min-width:1380px)']: {
      margin: '0 20px',
      minWidth: 300,
    },
  },
})

export default function Account(props) {
  const classes = useStyles()
  const [listAccounts, setListAccounts] = useState([])
  const [listProperties, setListProperties] = useState([])
  const [listViews, setListViews] = useState([])
  const [chosenAccount, setChosenAccount] = useState({
    name: null,
  })
  const [chosenProperty, setChosenProperty] = useState({
    name: null,
  })
  const [chosenView, setChosenView] = useState({
    name: null,
  })
  const [chosenMetric, setChosenMetric] = useState({
    value: null,
    label: null,
  })
  const [accountData, setAccountData] = useState(null)

  useEffect(() => {
    if (props.apiReady) {
      console.log('Api Ready')
      gapi.client.load('analytics', 'v3').then(() => {
        gapi.client.analytics.management.accounts.list().then((response) => {
          setListAccounts(
            response.result.items.sort((a, b) => {
              return a.name > b.name ? 1 : -1
            })
          )
        })
      })
    }
  }, [props.apiReady])

  useEffect(() => {
    if (chosenAccount.name) {
      console.log('Account selected')
      gapi.client.analytics.management.webproperties
        .list({ accountId: chosenAccount.id })
        .then((response) => {
          setListProperties(
            response.result.items.sort((a, b) => {
              return a.name > b.name ? 1 : -1
            })
          )

          setAccountData({
            accountId: chosenAccount.id,
            propertyId: null,
            viewId: null,
            metric: null,
          })

          setChosenProperty({ name: null })
          setChosenView({ name: null })
          setChosenMetric(null)
        })
        .then((err) => {
          console.log(err)
        })
    }
  }, [chosenAccount])

  useEffect(() => {
    if (chosenProperty.name) {
      console.log('Property selected')
      gapi.client.analytics.management.profiles
        .list({
          accountId: chosenProperty.accountId,
          webPropertyId: chosenProperty.id,
        })
        .then((response) => {
          setListViews(
            response.result.items.sort((a, b) => {
              return a.name > b.name ? 1 : -1
            })
          )

          setAccountData({
            accountId: chosenProperty.accountId,
            propertyId: chosenProperty.id,
            viewId: null,
            metric: null,
          })

          setChosenView({ name: null })
          setChosenMetric(null)
        })
        .then((err) => {
          console.log(err)
        })
    }
  }, [chosenProperty])

  useEffect(() => {
    if (chosenView) {
      setAccountData({
        accountId: chosenView.accountId,
        propertyId: chosenView.webPropertyId,
        viewId: chosenView.id,
        metric: null,
      })

      setChosenMetric(null)
    }
  }, [chosenView])

  useEffect(() => {
    if (chosenMetric) {
      setAccountData({
        accountId: chosenView.accountId,
        propertyId: chosenView.webPropertyId,
        viewId: chosenView.id,
        metric: chosenMetric.value,
      })
    }
  }, [chosenMetric])

  return (
    <Box>
      <Box className={classes.account}>
        <Typography className={classes.account__heading} component="h2">
          Pick the view you'd like to work with
        </Typography>
        <Box className={classes.account__form}>
          <Box className={classes.account__select}>
            <FormControl style={{ width: '100%', maxWidth: 300 }}>
              <Autocomplete
                disabled={!listAccounts.length}
                options={listAccounts}
                getOptionLabel={(account) => account.name}
                value={chosenAccount}
                renderInput={(params) => (
                  <TextField {...params} label="GA Account" />
                )}
                onChange={(event, value) => {
                  console.log(value)
                  setChosenAccount(value)
                }}
              />
              <FormHelperText>Start typing to search...</FormHelperText>
            </FormControl>
          </Box>
          <Box className={classes.account__select}>
            <FormControl style={{ width: '100%', maxWidth: 300 }}>
              <Autocomplete
                disabled={!listProperties.length}
                options={listProperties}
                getOptionLabel={(property) => property.name}
                value={chosenProperty}
                renderInput={(params) => (
                  <TextField {...params} label="GA Property" />
                )}
                onChange={(event, value) => {
                  setChosenProperty(value)
                }}
              />
              <FormHelperText>Pick GA account first.</FormHelperText>
            </FormControl>
          </Box>
          <Box className={classes.account__select}>
            <FormControl style={{ width: '100%', maxWidth: 300 }}>
              <Autocomplete
                disabled={!listViews.length}
                options={listViews}
                getOptionLabel={(property) => property.name}
                value={chosenView}
                renderInput={(params) => (
                  <TextField {...params} label="GA View" />
                )}
                onChange={(event, value) => {
                  console.log('View selected')
                  setChosenView(value)
                }}
              />
              <FormHelperText>Pick GA property first.</FormHelperText>
            </FormControl>
          </Box>
          <Box className={classes.account__select}>
            <FormControl style={{ width: '100%', maxWidth: 300 }}>
              <Autocomplete
                disabled={!chosenView}
                options={[
                  {
                    value: 'totalConversions',
                    label: 'Total Conversions',
                  },
                  {
                    value: 'conversionRate',
                    label: 'Conversion Rate',
                  },
                ]}
                getOptionLabel={(opt) => opt.label}
                value={chosenMetric}
                renderInput={(params) => (
                  <TextField {...params} label="Metric" />
                )}
                onChange={(event, value) => {
                  setChosenMetric(value)
                }}
              />
              <FormHelperText>Pick GA view first</FormHelperText>
            </FormControl>
          </Box>
        </Box>
      </Box>
      {React.cloneElement(props.children, { accountData })}
    </Box>
  )
}

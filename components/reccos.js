import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import ScheduleIcon from '@material-ui/icons/Schedule'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import TwitterIcon from '@material-ui/icons/Twitter'
import EmailIcon from '@material-ui/icons/Email'
import blue from '@material-ui/core/colors/blue'
import pink from '@material-ui/core/colors/pink'
import grey from '@material-ui/core/colors/grey'

const useStyles = makeStyles({
  reccos: {
    paddingTop: 20,
    textAlign: 'center',
    ['@media (min-width:700px)']: {
      padding: '40px 0',
      marginTop: 40,
    },
  },
  reccos__main: {
    fontWeight: 400,
    fontSize: 22,
    margin: '20px 0',
    textAlign: 'center',
    ['@media (min-width:700px)']: {
      fontSize: 34,
    },
  },
  reccos__mainHighlight: {
    fontWeight: 600,
    fontSize: 22,
    background: blue[100],
    color: 'white',
    padding: 10,
    margin: '0 10px',
    ['@media (min-width:700px)']: {
      fontSize: 34,
    },
  },
  reccos__filter: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    '&:hover p': {
      color: pink['A400'],
    },
  },
  reccos__filterLabel: {
    color: grey[300],
    fontWeight: 500,
    transition: '.3s',
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
    fontSize: '0.875rem',
  },
  reccos__filterLabelActive: {
    color: pink['A400'],
    fontWeight: 500,
    transition: '.3s',
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
    fontSize: '0.875rem',
  },
  reccos__filterList: {
    display: 'flex',
    padding: 0,
    margin: '0 0 0 20px',
    transform: 'translateY(-2px)',
  },
  reccos__filterListItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 5,
    cursor: 'pointer',
    color: grey[300],
    transition: '.3s',
    '&:hover': {
      color: 'black',
    },
  },
  reccos__filterListItemActive: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 5,
    cursor: 'pointer',
    color: 'black',
    transition: '.3s',
  },
  reccos__cards: {
    ['@media (min-width:700px)']: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
  reccos__card: {
    margin: '0 20px 40px',
    ['@media (min-width:700px)']: {
      margin: '0 40px',
    },
  },
  recco__secondary: {
    display: 'flex',
    fontWeight: 'bold',
    margin: '20px 20px 10px',
  },
  recco__icon: {
    marginRight: 8,
    transform: 'translateY(-1px)',
  },
  recco__listItem: {
    paddingLeft: 23,
  },
  results: {
    textAlign: 'center',
    width: '100%',
    display: 'none',

    ['@media (min-width:1080px)']: {
      display: 'block',
    },
  },
  results__inner: {
    display: 'none',
  },
  results__table: {
    marginTop: 40,
    display: 'none',
  },
})

export default function Reccos(props) {
  const classes = useStyles()
  const [mainRecco, setMainRecco] = useState([])
  const [bestDays, setBestDays] = useState([])
  const [bestTimes, setBestTimes] = useState([])
  const [fullResults, setFullResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (
      !props.accountData ||
      !props.accountData.accountId ||
      !props.accountData.propertyId ||
      !props.accountData.viewId ||
      !props.accountData.metric
    ) {
      console.log('No Account Data, clearing')
      reset()
    } else {
      console.log('reccos effect hook')
      console.log(props.accountData)

      const reportData = {
        viewId: props.accountData.viewId,
        dateRanges: [
          {
            startDate: '2020-04-01',
            endDate: '2020-04-30',
          },
        ],
        metrics: [
          {
            expression: 'ga:users',
          },
          {
            expression: 'ga:sessions',
          },
          {
            expression: 'ga:bounceRate',
          },
          {
            expression: 'ga:transactions',
          },
          {
            expression: 'ga:transactionsPerUser',
          },
          {
            expression: 'ga:goalCompletionsAll',
          },
          {
            expression: 'ga:goalConversionRateAll',
          },
        ],
        dimensions: [
          {
            name: 'ga:dayOfWeek',
          },
          {
            name: 'ga:hour',
          },
        ],
      }

      if (filter) {
        reportData['filtersExpression'] = filter
      }

      gapi.client
        .request({
          path: '/v4/reports:batchGet',
          root: 'https://analyticsreporting.googleapis.com/',
          method: 'POST',
          body: {
            reportRequests: [reportData],
          },
        })
        .then(formatResults)
        .catch((err) => {
          console.log(err)
        })
    }
  }, [props.accountData, filter])

  function formatResults(response) {
    let rows = response.result.reports[0].data.rows

    if (!rows) {
      alert("We couldn't find any results 😞")
      setFilter(false)
      return
    }

    // sort data by goal completions
    const sortBy = props.accountData.metric === 'conversionRate' ? 6 : 5
    rows = rows.sort((a, b) => {
      return b.metrics[0].values[sortBy] - a.metrics[0].values[sortBy]
    })

    // limit to first 20
    rows = rows.slice(0, 40)

    // find best day
    const days = []
    const bestDays = [0, 0, 0]
    const totalDays = [0, 0, 0]

    rows.forEach((row) => {
      if (!days[row.dimensions[0]]) {
        days[row.dimensions[0]] = 0
      }

      days[row.dimensions[0]]++
    })

    days.forEach((day, i) => {
      if (day > totalDays[0]) {
        totalDays[0] = day
        bestDays[0] = i
      } else if (day > totalDays[1]) {
        totalDays[1] = day
        bestDays[1] = i
      } else if (day > totalDays[2]) {
        totalDays[2] = day
        bestDays[2] = i
      }
    })

    // find best time
    const times = []
    const bestTimes = [0, 0, 0]
    const totalTimes = [0, 0, 0]

    rows.forEach((row) => {
      if (!times[row.dimensions[1]]) {
        times[row.dimensions[1]] = 0
      }

      times[row.dimensions[1]]++
    })

    times.forEach((time, i) => {
      if (time > totalTimes[0]) {
        totalTimes[0] = time
        bestTimes[0] = i
      } else if (time > totalTimes[1]) {
        totalTimes[1] = time
        bestTimes[1] = i
      } else if (time > totalTimes[2]) {
        totalTimes[2] = time
        bestTimes[2] = i
      }
    })

    setMainRecco([
      dayOfWeek(rows[0].dimensions[0]),
      twelveHour(rows[0].dimensions[1]),
    ])

    setBestDays(bestDays.map((day) => dayOfWeek(day)))
    setBestTimes(bestTimes.map((time) => twelveHour(time)))
    setFullResults(rows)
  }

  function dayOfWeek(num) {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    return days[num]
  }

  function twelveHour(hour) {
    const suffix = hour >= 12 ? 'pm' : 'am'
    return (hour % 12 || 12) + suffix
  }

  function toggleResults() {
    setShowResults(!showResults)
  }

  function toggleResultsButton() {
    return showResults ? (
      <Button
        color="secondary"
        onClick={() => toggleResults()}
        endIcon={<ArrowDropUpIcon />}>
        Hide full results
      </Button>
    ) : (
      <Button
        color="secondary"
        onClick={() => toggleResults()}
        endIcon={<ArrowDropDownIcon />}>
        Show full results
      </Button>
    )
  }

  function filterClasses(filterType) {
    let cls = classes.reccos__filterListItem
    if (filter === filterType) {
      cls += ` ${classes.reccos__filterListItemActive}`
    }

    return cls
  }

  function updateFilter(filterType) {
    if (filter === filterType) {
      setFilter(false)
    } else {
      setFilter(filterType)
    }
  }

  function reset() {
    setMainRecco([])
    setBestDays([])
    setBestTimes([])
    setFullResults([])
    setShowResults(false)
  }

  return (
    <Box style={{ display: props.accountData ? 'block' : 'none' }}>
      <Box
        className={classes.reccos}
        style={{ display: mainRecco.length ? 'block' : 'none' }}>
        <Typography className={classes.reccos__main}>
          ⭐️ Conversion time is{' '}
          <Typography
            className={classes.reccos__mainHighlight}
            component="span">
            {mainRecco[0]}
          </Typography>
          at
          <Typography
            className={classes.reccos__mainHighlight}
            component="span">
            {mainRecco[1]}
          </Typography>
          ⭐️
        </Typography>
        <Box className={classes.reccos__filter}>
          <Typography
            className={
              filter
                ? classes.reccos__filterLabelActive
                : classes.reccos__filterLabel
            }>
            Filter results
          </Typography>
          <ul className={classes.reccos__filterList}>
            <li
              className={filterClasses('ga:socialNetwork==Facebook')}
              onClick={() => updateFilter('ga:socialNetwork==Facebook')}>
              <FacebookIcon />
            </li>
            <li
              className={filterClasses('ga:socialNetwork=~^Instagram')}
              onClick={() => updateFilter('ga:socialNetwork=~^Instagram')}>
              <InstagramIcon />
            </li>
            <li
              className={filterClasses('ga:socialNetwork==Twitter')}
              onClick={() => updateFilter('ga:socialNetwork==Twitter')}>
              <TwitterIcon />
            </li>
            <li
              className={filterClasses('ga:socialNetwork==LinkedIn')}
              onClick={() => updateFilter('ga:socialNetwork==LinkedIn')}>
              <LinkedInIcon />
            </li>
            <li
              className={filterClasses('ga:channelGrouping==Email')}
              onClick={() => updateFilter('ga:channelGrouping==Email')}>
              <EmailIcon />
            </li>
          </ul>
        </Box>
        <Box className={classes.reccos__cards}>
          <Card className={classes.reccos__card}>
            <CardContent>
              <Typography className={classes.recco__secondary}>
                <CalendarIcon className={classes.recco__icon} /> Best days of
                the week
              </Typography>
              <List>
                {bestDays.map((day, i) => {
                  let medals = ['🥇', '🥈', '🥉']

                  return (
                    <ListItem key={i} className={classes.recco__listItem}>
                      <ListItemText primary={`${medals[i]} ${day}`} />
                    </ListItem>
                  )
                })}
              </List>
            </CardContent>
          </Card>
          <Card className={classes.reccos__card}>
            <CardContent>
              <Typography className={classes.recco__secondary}>
                <ScheduleIcon className={classes.recco__icon} /> Best hours of
                the day
              </Typography>
              <List>
                {bestTimes.map((time, i) => {
                  let medals = ['🥇', '🥈', '🥉']

                  return (
                    <ListItem key={i} className={classes.recco__listItem}>
                      <ListItemText primary={`${medals[i]} ${time}`} />
                    </ListItem>
                  )
                })}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Box className={classes.results}>
        <Box
          className={classes.results__inner}
          style={{ display: fullResults.length ? 'block' : 'none' }}>
          {toggleResultsButton()}
          <TableContainer
            className={classes.results__table}
            style={{ display: showResults ? 'block' : 'none' }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Day of the week</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Sessions</TableCell>
                  <TableCell>Bounce rate</TableCell>
                  <TableCell>Transactions</TableCell>
                  <TableCell>Transactions per user</TableCell>
                  <TableCell>Goal completions</TableCell>
                  <TableCell>Goal conversion rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fullResults.map((row, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{dayOfWeek(row.dimensions[0])}</TableCell>
                      <TableCell>{twelveHour(row.dimensions[1])}</TableCell>
                      <TableCell>
                        {Number(row.metrics[0].values[0]).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {Number(row.metrics[0].values[1]).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {parseFloat(row.metrics[0].values[2]).toPrecision(4)}%
                      </TableCell>
                      <TableCell>{row.metrics[0].values[3]}</TableCell>
                      <TableCell>
                        {parseFloat(row.metrics[0].values[4]).toPrecision(1)}
                      </TableCell>
                      <TableCell>{row.metrics[0].values[5]}</TableCell>
                      <TableCell>
                        {parseFloat(row.metrics[0].values[6]).toPrecision(6)}%
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  )
}

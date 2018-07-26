// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { graphql, compose, withApollo, Query } from 'react-apollo'
import QueryAllEvents from '../GraphQL/QueryAllEvents'
import MutationDeleteEvent from '../GraphQL/MutationDeleteEvent'

import moment from 'moment'
import { ApolloQueryResult } from 'apollo-client'

import type { GetEventsQuery } from '../graphql-types.flow'

class EventsQuery extends Query<GetEventsQuery> {}

type AllEventsState = {
  busy: boolean
}

type AllEventsProps = {
  deleteEvent: (event: any) => ApolloQueryResult<any>,
  client: any
}

class AllEvents extends Component<AllEventsProps, AllEventsState> {
  state = {
    busy: false
  }

  static defaultProps = {
    events: [],
    deleteEvent: () => null
  }

  async handleDeleteClick(event, e) {
    e.preventDefault()

    if (window.confirm(`Are you sure you want to delete event ${event.id}`)) {
      const { deleteEvent } = this.props

      await deleteEvent(event)
    }
  }

  handleSync = async () => {
    const { client } = this.props
    const query = QueryAllEvents

    this.setState({ busy: true })

    await client.query({
      query,
      fetchPolicy: 'network-only'
    })

    this.setState({ busy: false })
  }

  renderEvent = event => (
    <Link to={`/event/${event.id}`} className="card" key={event.id}>
      <div className="content">
        <div className="header">{event.name}</div>
      </div>
      <div className="content">
        <p>
          <i className="icon calendar" />
          {moment(event.when).format('LL')}
        </p>
        <p>
          <i className="icon clock" />
          {moment(event.when).format('LT')}
        </p>
        <p>
          <i className="icon marker" />
          {event.where}
        </p>
      </div>
      <div className="content">
        <div className="description">
          <i className="icon info circle" />
          {event.description}
        </div>
      </div>
      <div className="extra content">
        <i className="icon comment" /> {event.comments.items.length} comments
      </div>
      <button
        className="ui bottom attached button"
        onClick={this.handleDeleteClick.bind(this, event)}
      >
        <i className="trash icon" />
        Delete
      </button>
    </Link>
  )

  render() {
    const { busy } = this.state
    // const { events } = this.props;

    return (
      <div>
        <div className="ui clearing basic segment">
          <h1 className="ui header left floated">All Events</h1>
          <button
            className="ui icon left basic button"
            onClick={this.handleSync}
            disabled={busy}
          >
            <i
              aria-hidden="true"
              className={`refresh icon ${busy ? 'loading' : ''}`}
            />
            Sync with Server
          </button>
        </div>
        <div className="ui link cards">
          <div className="card blue">
            <Link to="/newEvent" className="new-event content center aligned">
              <i className="icon add massive" />
              <p>Create new event</p>
            </Link>
          </div>
          {/* {[].concat(events).sort((a, b) => a.when.localeCompare(b.when)).map(this.renderEvent)} */}
          <EventsQuery query={QueryAllEvents}>
            {({ data, loading, error }) => {
              console.log(data)
              return null
            }}
          </EventsQuery>
        </div>
      </div>
    )
  }
}

export default withApollo(
  compose(
    // graphql(QueryAllEvents, {
    //   options: {
    //     fetchPolicy: 'cache-first'
    //   },
    //   props: ({ data: { listEvents = { items: [] } } }) => ({
    //     events: listEvents.items
    //   })
    // }),
    graphql(MutationDeleteEvent, {
      options: {
        update: (proxy, { data: { deleteEvent } }) => {
          const query = QueryAllEvents
          const data = proxy.readQuery({ query })

          data.listEvents.items = data.listEvents.items.filter(
            event => event.id !== deleteEvent.id
          )

          proxy.writeQuery({ query, data })
        }
      },
      props: props => ({
        deleteEvent: event => {
          return props.mutate({
            variables: { id: event.id },
            optimisticResponse: () => ({
              deleteEvent: {
                ...event,
                __typename: 'Event',
                comments: { __typename: 'CommentConnection', items: [] }
              }
            })
          })
        }
      })
    })
  )(AllEvents)
)

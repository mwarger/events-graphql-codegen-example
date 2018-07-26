/* @flow */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type GetEventsQuery = {|
  // Paginate through events.
  listEvents: ? {|
    __typename: "EventConnection",
    items: ? Array<? {|
      __typename: string,
      id: string,
      name: ?string,
      where: ?string,
      when: ?string,
      description: ?string,
      // Paginate through all comments belonging to an individual post.
      comments: ? {|
        __typename: string,
        items: ? Array<? {|
          __typename: string,
          // A unique identifier for the comment.
          commentId: string,
        |} >,
      |},
    |} >,
  |},
|};
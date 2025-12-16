import { graphql, HttpResponse } from 'msw'
import {
  TypedDocumentNode,
  DocumentTypeDecoration,
} from '@graphql-typed-document-node/core'

const GetUserQuery = {} as TypedDocumentNode<
  {
    user: {
      name: 'John'
    }
  },
  { userId: string }
>

graphql.query(GetUserQuery, ({ variables }) => {
  variables.userId.toUpperCase()

  return HttpResponse.json({
    data: {
      user: { name: 'John' },
    },
  })
})

graphql.query(GetUserQuery, ({ variables }) => {
  // @ts-expect-error Unknown variable
  variables.unknownVariable

  return HttpResponse.json({
    data: {
      user: { name: 'John' },
    },
  })
})

graphql.query(GetUserQuery, () => {
  return HttpResponse.json({
    data: {
      user: {
        // @ts-expect-error Invalid response type.
        name: 123,
      },
    },
  })
})

class TypedDocumentString<Result, Variables>
  extends String
  implements DocumentTypeDecoration<Result, Variables>
{
  __apiType?: (variables: Variables) => Result
  __resultType?: Result
  __variablesType?: Variables

  constructor(private value: string) {
    super(value)
  }

  toString(): string {
    return this.value
  }
}

const GetUserQueryString = new TypedDocumentString<
  {
    user: {
      name: 'John'
    }
  },
  { userId: string }
>('query GetUser { user { name } }')

graphql.query(GetUserQueryString, ({ variables }) => {
  variables.userId.toUpperCase()

  return HttpResponse.json({
    data: {
      user: { name: 'John' },
    },
  })
})

graphql.query(GetUserQueryString, ({ variables }) => {
  // @ts-expect-error Unknown variable
  variables.unknownVariable

  return HttpResponse.json({
    data: {
      user: { name: 'John' },
    },
  })
})

graphql.query(GetUserQueryString, () => {
  return HttpResponse.json({
    data: {
      user: {
        // @ts-expect-error Invalid response type.
        name: 123,
      },
    },
  })
})

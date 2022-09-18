import { graphql } from 'graphql'
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools'
import { buildClientSchema, printSchema } from 'graphql/utilities'
import * as introspection from '../graphql/schema.json'

let userVerificationStatus = 'PENDING'

export const setUserVerificationStatus = (testType: string) => {
  if (testType === 'VERIFIED') {
    userVerificationStatus = testType
  } else if (testType === 'REJECTED') {
    userVerificationStatus = testType
  }
}

console.log('TCL: userVerificationStatus', userVerificationStatus)

const mockProducts = [
  {
    id: 'abd4c15d-e200-4712-a54c-1a1557a65233',
    createdAt: '2020-02-05T15:25:15.367Z',
    updatedAt: '2020-02-05T15:25:15.367Z',
    range: 'Cleansing CP',
    code: '411905',
    name: 'CP Phytoactive Reactivating',
    size: '100ml',
    priceExVat: '370.43',
    retailPrice: '426.00',
    wholeSalePrice: '206.81',
    __typename: 'Product'
  }
]

const mocks = {
  AWSEmail: () => 'jean@sov.tech',
  AWSJSON: () => ({
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false
  }),
  AWSDateTime: () => new Date(),
  PointConfig: () => ({
    id: '12b9b52a-701a-4a9f-8873-ca8c444be152',
    createdAt: '2020-02-11T10:32:22.787Z',
    updatedAt: '2020-02-11T10:32:22.787Z',
    percentPointsPerRand: 2,
    randValueCashPoints: 1,
    randValueVoucherPoints: 2,
    whiteRoseLevel: 3000,
    pinkRoseLevel: 4000,
    blackRoseLevel: 5000
  }),
  User: () => {
    return {
      id: '12b9b52a-701a-4a9f-8873-ca8c444be152',
      email: 'test@test.com',
      verificationStatus: userVerificationStatus,
      sales: {
        items: [
          {
            products: JSON.stringify(mockProducts)
          }
        ]
      }
    }
  },
  Sale: () => {
    return {
      products: JSON.stringify([
        {
          product: {
            label: 'Age ID Serum Foundation 02 (646202)',
            value: {
              createdAt: '2020-02-05T15:25:16.325Z',
              priceExVat: '1,070.43',
              code: '646202',
              wholeSalePrice: '597.62',
              size: '30ml',
              __typename: 'Product',
              name: 'Age ID Serum Foundation 02',
              range: 'AGE ID MAKEUP',
              id: '6dc72e13-de84-4380-90db-3a511fb69e35',
              retailPrice: '1,231.00',
              updatedAt: '2020-02-05T15:25:16.325Z'
            }
          },
          quantity: '5'
        }
      ]),
      treatments: JSON.stringify([
        {
          treatment: {
            label: 'SPA Body Treatment',
            value: {
              createdAt: '2020-02-19T14:08:25.508Z',
              cost: '100',
              __typename: 'Treatment',
              id: '744c3738-6cb2-4369-ae8b-a679b8b23bfe',
              category: 'SPA Body Treatment',
              updatedAt: '2020-02-19T14:08:25.508Z'
            }
          },
          quantity: 1
        }
      ])
    }
  }
}

// @ts-ignore
const schemaSDL = printSchema(buildClientSchema(introspection.data))
export const schema = makeExecutableSchema({
  typeDefs: schemaSDL
})

// add mocks, modify schema in place
addMockFunctionsToSchema({ schema, mocks })

/**
 * Helper function to return mock data from a specified
 * graphql schema.
 * @param query - Query document which you are mocking
 * @param args - Any arguments which are required for the query / mutation
 * to be executed.
 */

export const getMockData = async (query: any, args = {}) => {
  try {
    const res: any = await graphql(schema, query.loc.source.body, null, null, args)
    if (res && res.data) {
      res.data.loading = false
      return res.data
    }
    if (res.errors && res.errors.length > 0) {
      console.log('GQL Mock Error: ', res.errors[0])
    }
  } catch (error) {
    console.log(error.message)
  }
}

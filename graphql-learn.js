const express = require('express')
const graphql = require('graphql')
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require('graphql')
// GraphQLObjectType -- this is used to create the types like the user for example.
// GraphQString, GraphQLInt  -- these refer to the types in the schemas we create-- like string as in _name, email and int as in ID of the user

// visit the docs to learn more

const { graphqlHTTP } = require('express-graphql')
const app = express()
const PORT = 6969
const userData = require('./MOCK_DATA.json')


const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLInt },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    gender: { type: GraphQLString },
  }
})
//  we're basically creating the UserType here. like the user deets.

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLInt } }, // an argument to find it, i guess.
      resolve(parent, args) {
        return userData // for mySQL you return the select blablabla and for mongoDB you return your findbywhatever (you understand).
      }
      // resolve is a simple function with two arguments parent,args-- args as an argument point to the args above and i think we have to write a custom function to ----
    }
    // getUserById -- these are examples of fields. ik these ring a bell, and yeah, you're right.
  }
})
// to create a query, we're gonna use the GraphQLObjectType

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
      },
      resolve(parent, args) {
        userData.push({ id: userData.length + 1, first_name: args.first_name, last_name: args.last_name, email: args.email, gender: args.gender })
        return args // basically saying res.send() if you're using a restful api.
      }
    }
  }
})
// for mutating the data; create, update and delete stuff.



const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation })

app.use('/graphql', graphqlHTTP({
  schema, // how are we gonna create the schema ?
  graphiql: true
}))

app.listen(PORT, () => {
  console.log('Server running!')
})


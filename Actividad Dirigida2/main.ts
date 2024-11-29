//Actividad Dirigida 2 Ivan García-Diego

import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import { MongoClient } from "mongodb";
import { FlightModel } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";

// Cargar variables de entorno usando `load`
const env = await load();
const MONGO_URL = env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("airline");
const FlightsCollection = mongoDB.collection<FlightModel>("flights");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ FlightsCollection }),
});

console.info(`Server ready at ${url}`);

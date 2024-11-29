import { Collection, ObjectId } from "mongodb";
import { Flight, FlightModel } from "./types.ts";
import { formModelToFlight } from "./utils.ts";

export const resolvers = {
  Query: {
    getFlights: async (
      _: unknown,
      { origen, destino }: { origen?: string; destino?: string },
      context: { FlightsCollection: Collection<FlightModel> },
    ): Promise<Flight[]> => {
      const query: Partial<FlightModel> = {};
      if (origen) query.origen = origen;
      if (destino) query.destino = destino;

      const flightsModel = await context.FlightsCollection.find(query).toArray();
      return flightsModel.map(formModelToFlight);
    },
    getFlight: async (
      _: unknown,
      { id }: { id: string },
      context: { FlightsCollection: Collection<FlightModel> },
    ): Promise<Flight | null> => {
      const flightModel = await context.FlightsCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!flightModel) return null;
      return formModelToFlight(flightModel);
    },
  },
  Mutation: {
    addFlight: async (
      _: unknown,
      { origen, destino, fechaHora }: { origen: string; destino: string; fechaHora: string },
      context: { FlightsCollection: Collection<FlightModel> },
    ): Promise<Flight> => {
      const { insertedId } = await context.FlightsCollection.insertOne({
        origen,
        destino,
        fechaHora,
      });
      const flightModel = {
        _id: insertedId,
        origen,
        destino,
        fechaHora,
      };
      return formModelToFlight(flightModel);
    },
  },
};

import mongoose, { type FilterQuery, type UpdateQuery, type UpdateWithAggregationPipeline } from "mongoose"

let connection: mongoose.Connection | undefined = undefined;

if(!process.env.MONGO_URL || !process.env.MONGO_USER || !process.env.MONGO_PWD || !process.env.MONGO_DB) {
    throw new Error("Please define the MONGO_URL environment variable inside .env.local")
}

const MONGO_URL = process.env.MONGO_URL;

let pendingRequestCount = 0;
let connectionCloseTimeout: Timer  | undefined = undefined;

export const connectToMongo = async () => {
    mongoose.connect(MONGO_URL)
    .then((connection) => {
        connection = connection;
        console.log("Connected to MongoDB")
        return connection;
    });
}

export const disconnectFromMongo = async () => {
    if(pendingRequestCount > 0) {
        if(!connectionCloseTimeout) {
            connectionCloseTimeout = setTimeout(() => {
                disconnectFromMongo();
                connectionCloseTimeout = undefined;
            }, 1000);
        }
    }
    connection?.close();
    connection = undefined;
}

export const createOrUpdate = async (model: mongoose.Model<mongoose.Document>, data: unknown) => {
    pendingRequestCount++;
    const doc = new model(data);
    const res = await doc.save();
    pendingRequestCount--;
    return res;
}

export const createOrUpdateMany = async (model: mongoose.Model<mongoose.Document>, data: unknown[]) => {
    pendingRequestCount++;
    const res = await model.insertMany(data);
    pendingRequestCount--;
    return res;
}

export const find = async (model: mongoose.Model<mongoose.Document>, query: FilterQuery<Document>) => {
    pendingRequestCount++;
    const res = await model.find(query);
    pendingRequestCount--;
    return res;
}

export const findOne = async (model: mongoose.Model<any>, query: FilterQuery<unknown>) => {
    pendingRequestCount++;
    const res = await model.findOne(query);
    pendingRequestCount--;
    return res;
}

export const update = async (model: mongoose.Model<mongoose.Document>, query: FilterQuery<Document>, data: UpdateQuery<unknown> | UpdateWithAggregationPipeline) => {
    pendingRequestCount++;
    const response = await model.updateOne(query, data);
    pendingRequestCount--;
    return response;
}

export const updateMany = async (model: mongoose.Model<mongoose.Document>, query: FilterQuery<Document>, data: UpdateQuery<unknown> | UpdateWithAggregationPipeline) => {
    pendingRequestCount++;
    const res = await model.updateMany(query, data);
    pendingRequestCount--;
    return res;
}

export const deleteOne = async (model: mongoose.Model<mongoose.Document>, query: FilterQuery<Document>) => {
    pendingRequestCount++;
    const res = await model.deleteOne(query);
    pendingRequestCount--;
    return res;
}

export const deleteMany = async (model: mongoose.Model<mongoose.Document>, query: FilterQuery<Document>) => {
    pendingRequestCount++;
    const res = await model.deleteMany(query);
    pendingRequestCount--;
    return res;
}
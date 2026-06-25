import mongoose from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //one who is subscribing to the channel
      ref: "User",  
    },
    channel: {
      type: Schema.Types.ObjectId, //the channel to which the user is subscribing
      ref: "User",
    }
  },
  {
    timestamps: true
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
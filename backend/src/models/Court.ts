// Court database model with type, pricing, images, and availability

import mongoose, { Schema } from "mongoose";
import { ICourt } from "../types/interfaces";
import { CourtType } from "../types/enums";

const courtSchema = new Schema<ICourt>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(CourtType),
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      default: "Kathmandu",
    },
    openTime: {
      type: String,
      required: true,
      default: "06:00",
    },
    closeTime: {
      type: String,
      required: true,
      default: "22:00",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Court = mongoose.model<ICourt>("Court", courtSchema);

export default Court;

const { Schema, model } = require("mongoose");

const borrowerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bookId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
  },
  { timestamps: true }
);

module.exports = model("Borrower", borrowerSchema);

const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema;

const CarSchema = new Schema({
        make: {
            type: Schema.Types.String,
            required: true
        },
        model: {
            type: Schema.Types.String,
            required: true
        },
        color: {
            type: Schema.Types.String,
            required: true
        },
        license_plate: {
            type: Schema.Types.String,
            // default: null
        },
        time: {
            type: Schema.Types.Date,
            default: Date.now()
        },
        organization: {
            type: Schema.Types.String,
            default: '1'
        }
    },
);

CarSchema.plugin(findOrCreate)

module.exports = mongoose.model('cars', CarSchema);
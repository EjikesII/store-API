const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide a sensible name for the item']
    },
    brand:{
        type:String,
        values: ['Bedmate', 'Royal Funiture', 'Cadence Interior', 'marcos', 'Federico'],
        message: '{VALUES} products are not accepted due to quality issues'
    },
    price:{
        type:Number,
        required:[true,'Enter the price of the item']
    },
    featured:{
        type:Boolean,
        default:false,
    },
    rating:{
        type:Number,
        default:4.0,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },

});

module.exports = mongoose.model('Product', productSchema)
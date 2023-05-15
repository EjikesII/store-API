const Product = require('../models/product');

//Postman/Database operations testing logic
const getAllProductsStatic = async (req,res) => {
    const products = await Product.find({price:{$gt: 300000}})
    .sort('price')
    .select('name price')
    .limit(10)
    .skip(0)
       // name: { $regex: search, $options: 'i' },
    res.status(200).json({products, nbHits:products.length})
};
//Main Database operation logic implementation
const getAllProducts = async (req,res) => {
    const { featured, brand, name, sort, fields, numericFilters } = req.query
    const queryObject = {}
    
    if ( featured ) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if ( brand ) {
        queryObject.brand = brand
    }
    if (name){
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match)=>`-${operatorMap[match]}-`)
        //console.log(filters)
        const substitute = ['price','rating'];
        filters = filters.split(',').forEach((item) => {
            const [field,operator,value] = item.split('-')
            if(substitute.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    };
    console.log(queryObject)
    let result = Product.find(queryObject)
    //result sorting logic
    if (sort){
        //products.products.sort()
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    }
    else {
         result = result.sort('createdAt')
    }
    //Field Select/search logic
    if (fields) {
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
const page = Number(req.query.page) || 1
const limit = Number(req.query.limit) || 50
const skip = (page -1) * limit;

result = result.skip(skip).limit(limit)
    const products = await result
    res.status(200).json({ products, nbHits:products.length })
};

module.exports = {
    getAllProducts,
    getAllProductsStatic,
};

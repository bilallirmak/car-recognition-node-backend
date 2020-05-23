const express = require('express');
const router = express.Router();
const socketHelper = require('../helpers/socket')

const Car = require('../helpers/db/models');

router.get('/', (req, res, next) => {
    res.render('index', {title: 'Express'});
});


router.post('/', (req, res) => {
    res.json({
        status: "ok"
    })
    req.body.forEach(item => {
        if (item.hasOwnProperty('license_plate')) {
            Car.findOrCreate({license_plate: item.license_plate}, item, (err, click, created) => {
                if (created) {
                    socketHelper.dataEmit(click)
                }
                console.log(created, "created")
                console.log(click, "click")

            })
        } else {
            const car = new Car(item)
            car.save().then(data => {
                // res.json({status: true})
                socketHelper.dataEmit(data)
            })
        }


    })
});

router.get('/get-data', (req, res) => {
    Car.find({}, (err, cars) => {
        if (err) {
            res.json({err})
            console.log(err)
        } else {
            res.json({cars})
        }
    })
})

router.get('/stat', (req, res) => {
    Car.aggregate([{
        $group: {
            _id: {make: "$make"},
            total_car: {$sum: 1},
            detail: {
                $push: "$$ROOT"
            },
            models: {$push: "$model"},
            // makes: {$push: "$make"},
            colors: {$push: "$color"},
            license_plates: {$push: {$substr: ["$license_plate", 0, 2]}},

        }
    },
        {
            $sort: {'total_car': -1}
        },
        {
            $group: {
                _id: null,
                total_car_number: {$sum: "$total_car"},
                total_model_number: {$sum: {$size: "$models"}},
                models: {$push: "$models"},
                colors: {$push: "$colors"},
                license_plates: {$push: "$license_plates"},
                files: {
                    $push: "$$ROOT"
                },
            }
        },
    ], (err, cars) => {
        if (err) {
            console.log(err)

            res.json({
                status: false,

            })
        } else {
            res.json({
                status: true,
                cars
            })
        }
    })

})

router.get('/dataa', (req, res) => {
    Car.find({}, (err, data) => {
        if (err) {
            res.json({err})
            console.log(err)
        } else {
            res.json({data})
        }

    })
});

router.post('/update', (req, res) => {
    Car.findByIdAndUpdate({_id: req.body._id}, {color: 'Blue'}, (err, data) => {
        console.log(req.body)
        res.json({
            status: true
        })
    })

});


module.exports = router;

const { Cat } = require('../models')
module.exports = {
    // get all cat
    async index(req, res) {
        try {
            const cat = await Cat.findAll()
            res.send(cat)
        } catch (err) {
            res.status(500).send({
                error: 'information was incorrect'
            })
        }
    },
    // create cat
    async create(req, res) {
        console.log(JSON.stringify(req.body))
        try {
            const cat = await Cat.create(req.body)
            res.send(cat.toJSON())
        } catch (err) {
            res.status(500).send({
                error: 'Create incorrect'
            })
        }
    },
    // edit cat, suspend, active
    async put(req, res) {
        try {
            await cat.update(req.body, {
                where: {
                    id: req.params.catId
                }
            })
            res.send(req.body)
        } catch (err) {
            res.status(500).send({
                error: 'Update incorrect'
            })
        }
    },
    
// delete cat
async remove(req, res) {
        try {
            const cat = await Cat.findOne({
                where: {
                    id: req.params.catId
                }
            })
            if (!cat) {
                return res.status(403).send({
                    error: 'The cat information was incorrect'
                })
            }
            await cat.destroy()
            res.send(cat)
        } catch (err) {
            res.status(500).send({
                error: 'The cat information was incorrect'
            })
        }
    },
    // get cat by id
    async show(req, res) {
        try {
            const cat = await Cat.findByPk(req.params.catId)
            res.send(cat)
        } catch (err) {
            console.log(err)
            res.status(500).send({
                error: 'The cat information was incorrect'
            })
        }
    }
}

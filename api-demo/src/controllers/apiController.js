const items = [];

const apiController = {
    getItems: (req, res) => {
        res.json(items);
    },
    createItem: (req, res) => {
        const newItem = req.body;
        items.push(newItem);
        res.status(201).json(newItem);
    }
};

module.exports = apiController;
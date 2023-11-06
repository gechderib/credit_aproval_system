const uploadFile = require("../middleware/upload.middleware");


const ingestRoute = app => {
    const excelController = require("../controllers/excel.controller");

    var router = require("express").Router();

    router.post("/:model/", uploadFile.single("file"), excelController.upload);

    app.use('/api/upload', router);
};


module.exports = ingestRoute


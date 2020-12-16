//Name:Zichong Wang; SID:10464881; Course:CS546
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
   

    res.render("pages/connectus");
});

module.exports = router;

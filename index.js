let pieRepo = require("./repos/pieRepo");
let express = require("express");
let app = express();

let router = express.Router();

// router.get('/', function (req, res, next) {
//     res.send("Apple");
// });
// Configure middleware to support JSON data parsing in request object
app.use(express.json());

router.get("/", (req, res, next) => {
  pieRepo.get(
    (data) => {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retrieved.",
        data: data,
      });
    },
    (err) => {
      next(err);
    },
  );
});
// Create/search?id=n&name=str to search for pies by "id" and/or "name"
router.get("/search", (req, res, next) => {
  let searchObject = {
    id: req.query.id,
    name: req.query.name,
  };

  pieRepo.search(
    searchObject,
    (data) => {
      res
        .status(200)
        .json({ status: 200, statusText: "OK", message: "all pies retrieved", data: data });
    },
    (err) => {
      next(err);
    },
  );
});

// Create GET/id to return a single pie
router.get("/:id", (req, res, next) => {
  pieRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          message: "Single pie retrieved.",
          data: data,
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `The pie ${req.params.id} could not be found.`,
          error: {
            code: "NOT_FOUND",
            message: `The pie ${req.params.id} could not be found.`,
          },
        });
      }
    },
    (err) => {
      next(err);
    },
  );
});

router.post("/", (req, res, next) => {
  pieRepo.insert(
    req.body,
    (data) => {
      res.status(201).json({
        status: 201,
        statusText: "Created",
        message: "New pie added.",
        data: data,
      });
    },
    (err) => {
      next(err);
    },
  );
});

// Create PUT/id to return a single pie
router.put("/:id", (req, res, next) => {
  pieRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        pieRepo.update(req.body, req.params.id, (data) => {
          res.status(200).json({
            status: 200,
            statusText: "OK",
            message: `Pie ${req.params.id} was updated.`,
            data: data,
          });
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `The pie ${req.params.id} could not be found.`,
          error: {
            code: "NOT_FOUND",
            message: `The pie ${req.params.id} could not be found.`,
          },
        });
      }
    },
    (err) => {
      next(err);
    },
  );
});

router.delete("/:id", (req, res, next) => {
  pieRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        pieRepo.delete(req.params.id, (data) => {
          res.status(200).json({
            status: 200,
            statusText: "OK",
            message: `Pie ${req.params.id} is deleted.`,
            data: data,
          });
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `The pie ${req.params.id} could not be found.`,
          error: {
            code: "NOT_FOUND",
            message: `The pie ${req.params.id} could not be found.`,
          },
        });
      }
    },
    (err) => {
      next(err);
    },
  );
});

router.patch("/:id", (req, res, nest) => {
  pieRepo.getById(req.params.id, (data) => {
    if (data) {
      pieRepo.update(req.body, req.params.id, (data) => {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          message: `Pie ${req.params.id} patched.`,
          data: data,
        });
      });
    } else {
      res.status(404).json({
        status: 404,
        statusText: "Not Found",
        message: `The pie ${req.params.id} could not be found.`,
        error: {
          code: "NOT_FOUND",
          message: `The pie ${req.params.id} could not be found.`,
        },
      });
    }
  });
});

app.use("/api/", router);

const server = app.listen(5000, () => {
  console.log("Node server is running on http://localhost:5000..");
});

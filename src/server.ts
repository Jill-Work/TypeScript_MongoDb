import express , { Request ,Response} from 'express';

const router = require('../src/routes/index');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 5000;

app.use('/api', router);

app.use('/', (req:Request, res:Response) => {
    res.status(400).json({ Message: "Invalid Route" });
});

app.listen(port, ():void => {
    console.log('port started on port => 5000')
});

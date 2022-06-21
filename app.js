const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaCategorias = require('./routes/categorias');
const res = require('express/lib/response');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); // BodyParser Apenas JSON de entrada no Body
app.use(bodyParser.json()); // BodyParser Apenas JSON de entrada no Body

app.use((req, res, next) => { 
    res.header('Access-Control-Allow-Origin','*')
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/categorias', rotaCategorias);

// Quando não encontrar a rota. Retorna:
app.use((req, res, next) =>{
    const erro = new Error('Não encontrado :(');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;
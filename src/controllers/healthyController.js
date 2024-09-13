const getPrueba = (req, res) => {
    res.status(200).json({
      health: 'live',
      status: 200,
      message: 'ok'
    });
  };
  
module.exports = { getPrueba };
  
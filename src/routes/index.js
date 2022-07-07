const {Router} = require('express');
const router = Router(); 

const {getConnection, getPersonas, getPersonasByID, addPersonas, deletePersona, updatePersona} = require('../controlers/index.controler');

router.get('/getConnection', getConnection);
router.get('/getPersonas', getPersonas);
router.post('/addPersonas', addPersonas);
router.get('/getPersonasByID/:id', getPersonasByID);
router.delete('/deletePersona/:id', deletePersona);
router.put('/updatePersona/:id', updatePersona);



module.exports = router;
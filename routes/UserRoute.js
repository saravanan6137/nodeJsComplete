const express = require('express');
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const router = express.Router();

// router.param('id', checkId)

router.post('/signup', authController.signUp)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.forgotPassword)
router.patch('/updatePassword', authController.protect, authController.updatePassword)

router.route('/').get(userController.getAllUsers).post(userController.createUser)
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser)

module.exports = router;

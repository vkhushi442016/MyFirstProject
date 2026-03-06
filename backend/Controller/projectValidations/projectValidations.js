const joi = require('joi')

const signUpSchema = joi.object({
    username: joi.string().alphanum().min(4).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-z0-9]{5,15}$')).required()
})

const loginSchema = joi.object({
    username: joi.string().alphanum().min(4).max(20).required(),
    password: joi.string().pattern(new RegExp('^[a-z0-9]{5,15}$')).required()
})


const validateSignUpSchema = (req, res, next) => {
    const { error } = signUpSchema.validate(req.body)
    if (error) {
        return res.status(400).json({
            success: "Error",
            message: error.details[0].message      //shows exact joi error
        })
    }
    next();
}

const validateLoginSchema = (req, res, next) => {
    const { error } = loginSchema.validate(req.body)
    if (error) {
        return res.send("Please enter in valid format")
    }
    next();
}

const SchoolDetailSchema = joi.object({
    dise_code: joi.string().length(11).pattern(/^\d+$/).required(),
    schoolName: joi.string().min(5).required(),
    district: joi.string().required(),
    city: joi.string().pattern(/^[A-Za-z\s]+$/).required(),
    classes: joi.string().pattern(/^[A-Za-z0-9,\s-]+$/).required(),     // allows letters, numbers, comma, dash
    staffCount: joi.number().integer().required(),
    studentCount: joi.number().integer().required(),
    syllabus: joi.number().required(),
    performance: joi.string().valid('Excellent', 'Good', 'Average', 'Poor').required()
})

const validateSchoolDetailSchema = (req, res, next) => {
    const { error } = SchoolDetailSchema.validate(req.body)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }
    next();
}

module.exports = { validateSignUpSchema, validateLoginSchema, validateSchoolDetailSchema }
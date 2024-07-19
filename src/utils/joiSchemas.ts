import Joi from "joi";

// Joi schemas for req.body validation.

const getCropSchema = () =>
	Joi.object({
		width: Joi.number().required(),
		height: Joi.number().required(),
		left: Joi.number().required(),
		top: Joi.number().required(),
		fileName: Joi.string().required(),
		newName: Joi.string().required(),
	});

const getResizeSchema = () =>
	Joi.object({
		width: Joi.number().required(),
		height: Joi.number().required(),
		fileName: Joi.string().required(),
		newName: Joi.string().required(),
		respectAspectRatio: Joi.boolean().required(),
	});

const getBlurSchema = () =>
	Joi.object({
		fileName: Joi.string().required(),
		newName: Joi.string().required(),
		sigma: Joi.number().required(),
	});

export { getCropSchema, getResizeSchema, getBlurSchema };

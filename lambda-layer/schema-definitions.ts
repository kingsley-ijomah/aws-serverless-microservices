import Ajv from 'ajv';

// Validate API Schema
export const validateAPISchema = async (schema: any, data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schema);
      const isValid = validate(data);

      if (isValid) {
        resolve({ isValid: true });
      } else {
        resolve({
          isValid: false,
          errors: validate.errors?.map((e) => e.message),
        });
      }
    } catch (error) {
      console.log(error);
      resolve({ isValid: false, errors: ['Error occurred while validating API payload'] });
    }
  });
};

// Add Product Schema
export const addProductSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    price: { type: 'number', minimum: 1 },
    imageFile: { type: 'string', minLength: 1 },
    category: { type: 'string', minLength: 1 }
  },
  required: ['name', 'description', 'price', 'imageFile', 'category'],
  additionalProperties: false,
};

// Update Product Schema
export const updateProductSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    price: { type: 'number', minimum: 1 },
    imageFile: { type: 'string', minLength: 1 },
    category: { type: 'string', minLength: 1 }
  },
  required: ['name', 'description', 'price', 'imageFile', 'category'],
  additionalProperties: false,
};
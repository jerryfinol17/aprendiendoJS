export interface CheckoutData {
    firstName: string;
    lastName: string;
    zipCode: string;
    expectedError?: string;
}

export const CHECKOUT_DATA: Record<string, CheckoutData> = {
    valid: {
        firstName: 'Juan',
        lastName: 'Pérez',
        zipCode: 'C1425',
    },
    invalidName: {
        firstName: '',
        lastName: 'Perez',
        zipCode: 'C1425',
        expectedError: 'Error: First Name is required',
    },
    invalidLastname: {
        firstName: 'Juan',
        lastName: '',
        zipCode: 'C1425',
        expectedError: 'Error: Last Name is required',
    },
    invalidZipCode: {
        firstName: 'Juan',
        lastName: 'Perez',
        zipCode: '',
        expectedError: 'Error: Postal Code is required',
    },
    allBlankCheckout: {
        firstName: '',
        lastName: '',
        zipCode: '',
        expectedError: 'Error: First Name is required',
    },
};
import CartParser from './CartParser';

let parser;

beforeEach(() => {
    parser = new CartParser();
});

describe("CartParser - unit tests", () => {
    // Add your unit tests here.

    test("should throw exception if exist validation errors (means exist > 0)", () => {
        let content = 'Product name,Price,Quantity';
        let validationErrors = parser.validate(content)

        expect(validationErrors.length).toEqual(0);
    });
});

describe("CartParser - integration tests", () => {
    // Add your integration tests here.
    
});
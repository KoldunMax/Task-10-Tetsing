import CartParser from './CartParser';

let parser;

beforeEach(() => {
    parser = new CartParser();
});

describe("CartParser - unit tests", () => {
    // Add your unit tests here.

    test("parse should return a JSON object if no validate errors", () => {   // 1

        let pathToCorrectTestCart = "./samples/correctTestingCart.csv";

        let resultOfParsing = parser.parse(pathToCorrectTestCart);

        expect(typeof resultOfParsing).toBe("object");

    });

    test("parse should throw exception if exist validate errors", () => {     // 2

        let pathToCorrectTestCart = "./samples/incorrectTestingCart.csv";
        
        expect(() => { parser.parse(pathToCorrectTestCart) } ).toThrow('Validation failed!');

    });

    test("validate should throw exception if exist one invalid header for cart", () => {     // 3

        let inavlidHeaders = "Product ame,Price,Quantity";   

        parser.createError = jest.fn();

        parser.validate(inavlidHeaders);

        expect(parser.createError).toHaveBeenCalledTimes(1);
        expect(parser.createError).toHaveBeenCalledWith('header', 0, 0, "Expected header to be named \"Product name\" but received Product ame.")

    });

    test("validate should throw exception if exist one header is empty for cart", () => {     // 3

        let inavlidHeaders = "Product name,Quantity";   

        parser.createError = jest.fn();

        parser.validate(inavlidHeaders);

        expect(parser.createError).toHaveBeenCalledTimes(2);
        expect(parser.createError).toHaveBeenCalledWith("header", 0, 2, "Expected header to be named \"Quantity\" but received undefined.");
        expect(parser.createError).toHaveBeenCalledWith("header", 0, 1, "Expected header to be named \"Price\" but received Quantity.");

    });

});

describe("CartParser - integration tests", () => {
    // Add your integration tests here.
    
});
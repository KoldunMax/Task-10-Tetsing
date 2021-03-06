import CartParser from './CartParser';
import { readFileSync } from 'fs';

let parser;

beforeEach(() => {
    parser = new CartParser();
});

describe("CartParser - unit tests", () => {
    // Add your unit tests here.

    test("parse should throw exception if exist validate errors", () => {     // 1

        let pathToCorrectTestCart = "./samples/incorrectTestingCart.csv";
        
        expect(() => { parser.parse(pathToCorrectTestCart) } ).toThrow('Validation failed!');

    });

    test("validate should throw exception if exist one invalid header for cart", () => {     // 2

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

    test("validate should throw exception if number of cells less than valid count of column", () => {     // 4

        let inavlidCoundOfCells = "Product name,Price,Quantity\n9.00,2";   

        parser.createError = jest.fn();

        parser.validate(inavlidCoundOfCells);

        expect(parser.createError).toHaveBeenCalledTimes(1);
        expect(parser.createError).toHaveBeenCalledWith("row", 1, -1, "Expected row to have 3 cells but received 2.");
    });

    test("validate should throw exception if column Product name is empty", () => {     // 5

        let inavlidCoundOfCells = "Product name,Price,Quantity\n,9.00,2";   

        parser.createError = jest.fn();

        parser.validate(inavlidCoundOfCells);

        expect(parser.createError).toHaveBeenCalledTimes(1);
        expect(parser.createError).toHaveBeenCalledWith("cell", 1, 0, "Expected cell to be a nonempty string but received \"\".");
    
    });

    test("validate should throw exception if column Price is not positive number", () => {     // 6

        function invalidPrice(price){
            return `Product name,Price,Quantity\nMollis consequat,${price},2`;
        }

        parser.createError = jest.fn();
        
            parser.validate(invalidPrice('String')); 
            parser.validate(invalidPrice(NaN));
            parser.validate(invalidPrice(undefined)); 
            parser.validate(invalidPrice(null));
            parser.validate(invalidPrice(true)); 
            parser.validate(invalidPrice(false));
            parser.validate(invalidPrice({}));
            parser.validate(invalidPrice(-10));
        
        expect(parser.createError).toHaveBeenCalledTimes(8);
                                                                      
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 1, "Expected cell to be a positive number but received \"-10\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 1, "Expected cell to be a positive number but received \"[object Object]\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 1, "Expected cell to be a positive number but received \"false\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 1, "Expected cell to be a positive number but received \"true\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 1, "Expected cell to be a positive number but received \"null\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 1, "Expected cell to be a positive number but received \"undefined\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 1, "Expected cell to be a positive number but received \"NaN\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 1, "Expected cell to be a positive number but received \"String\".");
                 
    });

    test("validate should throw exception if column Quantity is not positive number", () => {     // 7

        function invalidQuantity(quantity){
            return `Product name,Price,Quantity\nMollis consequat,9.00,${quantity}`;
        }

        parser.createError = jest.fn();
        
            parser.validate(invalidQuantity('String')); 
            parser.validate(invalidQuantity(NaN));
            parser.validate(invalidQuantity(undefined)); 
            parser.validate(invalidQuantity(null));
            parser.validate(invalidQuantity(true)); 
            parser.validate(invalidQuantity(false));
            parser.validate(invalidQuantity({}));
            parser.validate(invalidQuantity(-10));
        
        expect(parser.createError).toHaveBeenCalledTimes(8);
                                                                      
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 2, "Expected cell to be a positive number but received \"-10\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 2, "Expected cell to be a positive number but received \"[object Object]\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 2, "Expected cell to be a positive number but received \"false\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 2, "Expected cell to be a positive number but received \"true\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 2, "Expected cell to be a positive number but received \"null\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 2, "Expected cell to be a positive number but received \"undefined\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 2, "Expected cell to be a positive number but received \"NaN\".");
            expect(parser.createError).toHaveBeenCalledWith("cell", 1, 2, "Expected cell to be a positive number but received \"String\".");
                 
    });

    test("validate should not return not errors if csvLine is correct", () => {     // 8

        let validCoundOfCells = "Product name,Price,Quantity\nMollis consequat,9.00,2";   

        expect(parser.validate(validCoundOfCells)).toEqual([]);

    });

    test("parseLine should return an object with keys from column keys and values from CSV", () => {   // 9

        let csvLine = "Mollis consequat,9.00,2";

        let item = parser.parseLine(csvLine);

        expect(item.name).toBe("Mollis consequat");
        expect(item.price).toBe(9);
        expect(item.quantity).toBe(2);
        expect(!!item.id).toBe(true);

    });

    test("calcTotal should return total price when take several objects", () => {       // 10
        let pathToCorrectTestCart = "./samples/cart.csv";

        let exampleItems = 
        [ { 
            name: 'Mollis consequat',
            price: 9,
            quantity: 2 },
          { 
            name: 'Tvoluptatem',
            price: 10.32,
            quantity: 1,
        } ];

        let totalPrice = parser.calcTotal(exampleItems);

        expect(totalPrice).toBeCloseTo(28.32);

    });

    test("parse should return a JSON object if no validate errors", () => {   // 11

        let pathToCorrectTestCart = "./samples/cart.csv";

        let resultOfParsing = parser.parse(pathToCorrectTestCart);

        expect(!!resultOfParsing.items[0].id).toBe(true);
        expect(resultOfParsing.items[0].name).toBe("Mollis consequat");
        expect(resultOfParsing.items[0].price).toBe(9);
        expect(resultOfParsing.items[0].quantity).toBe(2);
        expect(resultOfParsing.total).toBe(348.32);

        expect(typeof resultOfParsing).toBe("object");

    });

    
});

describe("CartParser - integration tests", () => {
    // Add your integration tests here.

    test("check how to an object relations with methods", () => {   // 1
        
        const path = "./samples/cart.csv";

        const sourceFile = readFileSync(path, 'utf-8', 'r');  // Зчитуємо файл напряму

        const validateErrors = (new CartParser()).validate(sourceFile);  // Очікуємо пустий масив помилок

        const lines = sourceFile.split(/\n/).filter(l => l).filter((l, i) => i > 0);

        const items = lines.map(l => (new CartParser()).parseLine(l));   // Очікуємо сам масив об'єктів з проперті id, name, price, quantity;

        const totalPrice = (new CartParser()).calcTotal(items);  // Очікуємо суму всіх товарів 348.32
        
        expect(validateErrors).toEqual([]);
        
        expect(items[1].name).toBe("Tvoluptatem");
        expect(items[1].price).toBe(10.32);
        expect(items[1].quantity).toBe(1);

        expect(totalPrice).toBeCloseTo(348.32);

    });

});
const mongoose = require("mongoose");
const {User} = require("../../../models/user");
const jwt = require('jsonwebtoken');
const config = require('config');


describe('user.generateAuthToken',()=>{
    it('should return a valid JTW token',()=>{
        const id = new mongoose.Types.ObjectId()
        const user = new User({_id:id,isAdmin:true})
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject({_id:id, isAdmin:true});
    })
})



/*
describe('add funcion test',()=>{
    it('1 + 2= 3', () => {
        expect(sum(1, 2)).toBe(3);
    });

    it('1 + 3=4', () => {
        expect(sum(1, 3)).toBe(4);
    });

    it('1 + 4=5', () => {
        expect(sum(1, 4)).toBe(5);
    });

});


describe('arrayContaining', () => {
    const expected = ['Alice', 'Bob'];
    it('matches even if received contains additional elements', () => {
        expect(['Alice', 'Bob', 'Eve','Fabio']).toEqual(expect.arrayContaining(expected));
    });
    it('does not match if received does not contain expected elements', () => {
        expect(['Bob', 'Eve']).not.toEqual(expect.arrayContaining(expected));
    });
});
*/



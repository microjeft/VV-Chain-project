/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { VvChainContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('VvChainContract', () => {

    let contract: VvChainContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new VvChainContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"vv chain 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"vv chain 1002 value"}'));
    });

    describe('#vvChainExists', () => {

        it('should return true for a vv chain', async () => {
            await contract.vvChainExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a vv chain that does not exist', async () => {
            await contract.vvChainExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createVvChain', () => {

        it('should create a vv chain', async () => {
            await contract.createVvChain(ctx, '1003', 'vv chain 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"vv chain 1003 value"}'));
        });

        it('should throw an error for a vv chain that already exists', async () => {
            await contract.createVvChain(ctx, '1001', 'myvalue').should.be.rejectedWith(/The vv chain 1001 already exists/);
        });

    });

    describe('#readVvChain', () => {

        it('should return a vv chain', async () => {
            await contract.readVvChain(ctx, '1001').should.eventually.deep.equal({ value: 'vv chain 1001 value' });
        });

        it('should throw an error for a vv chain that does not exist', async () => {
            await contract.readVvChain(ctx, '1003').should.be.rejectedWith(/The vv chain 1003 does not exist/);
        });

    });

    describe('#updateVvChain', () => {

        it('should update a vv chain', async () => {
            await contract.updateVvChain(ctx, '1001', 'vv chain 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"vv chain 1001 new value"}'));
        });

        it('should throw an error for a vv chain that does not exist', async () => {
            await contract.updateVvChain(ctx, '1003', 'vv chain 1003 new value').should.be.rejectedWith(/The vv chain 1003 does not exist/);
        });

    });

    describe('#deleteVvChain', () => {

        it('should delete a vv chain', async () => {
            await contract.deleteVvChain(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a vv chain that does not exist', async () => {
            await contract.deleteVvChain(ctx, '1003').should.be.rejectedWith(/The vv chain 1003 does not exist/);
        });

    });

});

/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { VvChain } from './vv-chain';

@Info({title: 'VvChainContract', description: 'My Smart Contract' })
export class VvChainContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async vehicleDetailExists(ctx: Context, vvChainId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(vvChainId);
        return (!!data && data.length > 0);
    }

        @Transaction()
    public async createVehicleDetail(ctx: Context, 
        vvChainId: string, 
        customerName: string,
        ownerId: string,
        workshopId: string,
        workshopName: string,
        vehicleRegNo: string,
        vehicleMakeModel: string,
        engineNo: string,
        chasisNo: string,
        serviceId: string,
        serviceDate: string,
        mileage: number,
        engineOilType: string,
        engineOilReplaced: boolean,
        oilFilterReplaced: boolean,
        batteryModel: string,
        batteryReplaced: boolean,
        brakePadModel: string,
        brakePadReplaced: boolean,
        compressorReplaced: boolean,
        alternatorServiced:boolean,
        updateAcknowledged: boolean)
        : Promise<void> {
        const exists: boolean = await this.vehicleDetailExists(ctx, vvChainId);
        if (exists) {
            throw new Error(`The vv chain ${vvChainId} already exists`);
        }

        const vvChain: VvChain = new VvChain();
        vvChain.customerName = customerName;
        vvChain.ownerId = ownerId;
        vvChain.workshopId = workshopId;
        vvChain.workshopName = workshopName;
        vvChain.vehicleRegNo = vehicleRegNo;
        vvChain.vehicleMakeModel = vehicleMakeModel;
        vvChain.engineNo = engineNo;
        vvChain.chasisNo = chasisNo;
        vvChain.serviceId = serviceId;
        vvChain.serviceDate = serviceDate;
        vvChain.mileage = mileage;
        vvChain.engineOilType = engineOilType;
        vvChain.engineOilReplaced = engineOilReplaced;
        vvChain.oilFilterReplaced = oilFilterReplaced;
        vvChain.battreryModel = batteryModel;
        vvChain.batteryReplaced = batteryReplaced;
        vvChain.brakePadModel = brakePadModel;
        vvChain.brakePadReplaced = brakePadReplaced;
        vvChain.compressorReplaced = compressorReplaced;
        vvChain.alternatorServiced = alternatorServiced;
        vvChain.updateAcknowledged = updateAcknowledged;
        const buffer: Buffer = Buffer.from(JSON.stringify(vvChain));
        await ctx.stub.putState(vvChainId, buffer);
    }

    @Transaction(false)
    @Returns('VvChain')
    public async readVehicleDetail(ctx: Context, vvChainId: string): Promise<VvChain> {
        const exists: boolean = await this.vehicleDetailExists(ctx, vvChainId);
        if (!exists) {
            throw new Error(`The vv chain ${vvChainId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(vvChainId);
        const vvChain: VvChain = JSON.parse(data.toString()) as VvChain;
        return vvChain;
    }

    @Transaction()
    public async updateVehicleDetail(ctx: Context,
        vvChainId: string, 
        customerName: string,
        ownerId: string,
        workshopId: string,
        workshopName: string,
        vehicleRegNo: string,
        vehicleMakeModel: string,
        engineNo: string,
        chasisNo: string,
        serviceId: string,
        serviceDate: string,
        newmileage: number,
        engineOilType: string,
        engineOilReplaced: boolean,
        oilFilterReplaced: boolean,
        batteryModel: string,
        batteryReplaced: boolean,
        brakePadModel: string,
        brakePadReplaced: boolean,
        compressorReplaced: boolean,
        alternatorServiced:boolean,
        updateAcknowledged: boolean)
        : Promise<void> {
        const exists: boolean = await this.vehicleDetailExists(ctx, vvChainId);
        if (!exists) {
            throw new Error(`The vv chain ${vvChainId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(vvChainId);
        const vvChain: VvChain = JSON.parse(data.toString()) as VvChain;
        //const vvChain: VvChain = new VvChain();
        const invalidMileage: boolean = vvChain.mileage > newmileage;
        if (invalidMileage) {
            throw new Error(`The ${vehicleRegNo} new mileage is invalid`);
        }

        vvChain.customerName = customerName;
        vvChain.ownerId = ownerId;
        vvChain.workshopId = workshopId;
        vvChain.workshopName = workshopName;
        vvChain.vehicleRegNo = vehicleRegNo;
        vvChain.vehicleMakeModel = vehicleMakeModel;
        vvChain.engineNo = engineNo;
        vvChain.chasisNo = chasisNo;
        vvChain.serviceId = serviceId;
        vvChain.serviceDate = serviceDate;
        vvChain.mileage = newmileage;
        vvChain.engineOilType = engineOilType;
        vvChain.engineOilReplaced = engineOilReplaced;
        vvChain.oilFilterReplaced = oilFilterReplaced;
        vvChain.battreryModel = batteryModel;
        vvChain.batteryReplaced = batteryReplaced;
        vvChain.brakePadModel = brakePadModel;
        vvChain.brakePadReplaced = brakePadReplaced;
        vvChain.compressorReplaced = compressorReplaced;
        vvChain.alternatorServiced = alternatorServiced;
        vvChain.updateAcknowledged = updateAcknowledged;
        const buffer: Buffer = Buffer.from(JSON.stringify(vvChain));
        await ctx.stub.putState(vvChainId, buffer);
    }

    @Transaction()
    public async approveVehicleDetail(ctx: Context, vvChainId: string): Promise<void> {
        const exists: boolean = await this.vehicleDetailExists(ctx, vvChainId);
        if (!exists) {
            throw new Error(`The vv chain ${vvChainId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(vvChainId);
        const vvChain: VvChain = JSON.parse(data.toString()) as VvChain;
        const existsAcknowledged: boolean = vvChain.updateAcknowledged == true;
        if (existsAcknowledged) {
            throw new Error(`This ${vvChainId} service record is already acknowledged`);
        }

        vvChain.updateAcknowledged = true;
        const buffer: Buffer = Buffer.from(JSON.stringify(vvChain));
        await ctx.stub.putState(vvChainId, buffer);
    }
    
    @Transaction()
    public async ownershipTransfer(ctx: Context, vvChainId: string, newCustomerName: string, newOwnerId: string,): Promise<void> {
        const exists: boolean = await this.vehicleDetailExists(ctx, vvChainId);
        if (!exists) {
            throw new Error(`The vv chain ${vvChainId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(vvChainId);
        const vvChain: VvChain = JSON.parse(data.toString()) as VvChain;
        const existsOwnerId: boolean = newOwnerId == vvChain.ownerId;
        if (existsOwnerId) {
            throw new Error(`This ${newOwnerId} ownerId is already exist`);
        }
        vvChain.ownerId = newOwnerId;
        vvChain.customerName = newCustomerName;

        const buffer: Buffer = Buffer.from(JSON.stringify(vvChain));
        await ctx.stub.putState(vvChainId, buffer);
    }

    @Transaction()
    public async deleteVehicleDetail(ctx: Context, vvChainId: string): Promise<void> {
        const exists: boolean = await this.vehicleDetailExists(ctx, vvChainId);
        if (!exists) {
            throw new Error(`The vv chain ${vvChainId} does not exist`);
        }
        await ctx.stub.deleteState(vvChainId);
    }

}

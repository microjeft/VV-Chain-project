/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class VvChain {

    @Property()
    public value: string;
    customerName: string;
    ownerId: string;
    workshopId: string;
    workshopName: string;
    vehicleRegNo: string;
    engineNo: string;
    chasisNo: any;
    serviceId: any;
    serviceDate: string;
    mileage: number;
    engineOilType: string;
    engineOilReplaced: boolean;
    oilFilterReplaced: boolean;
    battreryModel: string;
    batteryReplaced: boolean;
    brakePadModel: string;
    brakePadReplaced: boolean;
    compressorReplaced: boolean;
    alternatorServiced: boolean;
    updateAcknowledged: boolean;
    vehicleMakeModel: string;

}

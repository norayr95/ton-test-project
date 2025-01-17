import '@ton-community/test-utils';

import { Cell, Address, toNano } from 'ton-core';
import { hex } from '../build/main.compiled.json';
import { Blockchain } from '@ton-community/sandbox';
import { MainContract } from '../wrappers/MainContract';
import { log } from 'console';


describe('main.fc contract tests', () => {
    it('should get the proper most recent sender address', async () => {
        const blockchain = await Blockchain.create();        

        const codeCell = Cell.fromBoc(Buffer.from(hex, 'hex'))[0];
        

        const myContract = blockchain.openContract(
            await MainContract.createFromConfig({}, codeCell)
        );

        const senderWallet = await blockchain.treasury('sender');

        const sendMessageResult = await myContract.sendInternalMessage(
            senderWallet.getSender(),
            toNano('0.05')
        );
        log(sendMessageResult)

        expect(sendMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

        const data = await myContract.getData();

        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());

        
    });
});

import {
    Address,
    Cell,
    Contract,
    ContractProvider,
    SendMode,
    Sender,
    beginCell,
    contractAddress,
} from 'ton-core';

export class MainContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromConfig(
        config: any,
        code: Cell,
        workchain = 0
    ): MainContract {
        const data = beginCell().endCell();
        const init = { code, data };
        const address = contractAddress(workchain, init);
        return new MainContract(address, init);
    }

    async sendInternalMessage(
        provider: ContractProvider,
        sender: Sender,
        value: bigint
    ): Promise<void>{
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getData(provider: ContractProvider): Promise<{ recent_sender: Address }> {
        const { stack } = await provider.get('get_the_latest_sender', []);
        return {
            recent_sender: stack.readAddress(),
        };
    }
}

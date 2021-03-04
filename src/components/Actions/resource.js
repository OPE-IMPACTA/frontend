class Operation {

    constructor() {
        this.alias = '';
    }

    addOperationQueue(self, callback) {
        self.$channelEvents.$on(self.$constantsEvents.SEND_COMMAND_ACTION, (received) => {
            if(this.alias == self.aliasAction) {

                let struct = callback();

                if (typeof struct.type === undefined || received.value.length === 0) {
                    throw new Error("Formato inválido. Forneça o campo e valor de type");
                } else {
                    struct[Object.keys(struct)[0]].type = received.value;
                }

                self.$channelEvents.$emit(self.$constantsEvents.ADD_OPERATION_QUEUE, struct);
            }
        });
    }
}

exports.Operation = new Operation;

#Tezos Hack

## Chainify


Smart contract:
```

import smartpy as sp

class AtomicSwap(sp.Contract):
    def __init__(self, notional, epoch, hashedSecret, owner, counterparty):
        self.init(notional     = notional,
                  hashedSecret = hashedSecret,
                  epoch        = epoch,
                  owner        = owner,
                  counterparty = counterparty)

    def checkAlive(self, identity):
        sp.verify(self.data.notional != sp.mutez(0))
        sp.verify(identity == sp.sender)

    def finish(self):
        self.data.notional = sp.mutez(0)

    @sp.entry_point
    def allSigned(self, params):
        self.checkAlive(self.data.owner)
        sp.send(self.data.counterparty, self.data.notional)
        self.finish()

    @sp.entry_point
    def cancelSwap(self, params):
        self.checkAlive(self.data.owner)
        sp.verify(self.data.epoch < sp.now)
        sp.send(self.data.owner, self.data.notional)
        self.finish()

    @sp.entry_point
    def knownSecret(self, params):
        self.checkAlive(self.data.counterparty)
        sp.verify(self.data.hashedSecret == sp.blake2b(params.secret))
        sp.send(self.data.counterparty, self.data.notional)
        self.finish()

                  
sp.add_compilation_target("atomicSwap", AtomicSwap(sp.mutez(12),sp.timestamp(50),sp.bytes("0x536f6d6553656563726574"), sp.address("tz1edeU3QZm88Z4P6Q4MaXGrbpMdatwG1oWG"), sp.address("tz1YtPfqVEjsbjogVsKv2mEWYvzLbgdivGj1")))

```
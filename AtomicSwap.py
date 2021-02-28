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

